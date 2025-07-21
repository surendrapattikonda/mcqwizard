from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber, docx, tempfile, os, json
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold # Import for specific safety settings
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use exact domain from Vercel
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Changed the model to gemini-2.0-flash as requested
model = genai.GenerativeModel("gemini-2.0-flash")

def extract_text(file: UploadFile) -> str:
    ext = file.filename.split('.')[-1].lower()
    temp_path = os.path.join(tempfile.gettempdir(), file.filename)
    with open(temp_path, "wb") as f:
        f.write(file.file.read())
    text = ""
    if ext == "pdf":
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text: text += page_text + "\n"
    elif ext in ["doc", "docx"]:
        doc = docx.Document(temp_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")
    # Clean up temp file
    os.remove(temp_path)
    return text.strip()

    
def generate_mcqs(text: str, question_count: int = 5):
    prompt = f"""
You are an intelligent MCQ generator.

From the following content, generate {question_count} diverse multiple choice questions. Each question should:
- Be one of these types: definition, conceptual, application, analytical
- Have exactly 4 options
- Include the correct answer
- Include a difficulty level: "easy", "medium", or "hard"

Return the output in strict JSON format. Do NOT include any additional text or formatting outside the JSON array.
Example of expected JSON structure:
```json
[
  {{
    "question": "...",
    "type": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "...",
    "difficulty": "..."
  }}
]
```

Here is the content:
{text}
    """
    
    # Use the more explicit safety settings from google.generativeai.types
    # Even with BLOCK_NONE, content could still be blocked if it's severely problematic
    safety_settings={
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE
    }
    
    try:
        response = model.generate_content(prompt, safety_settings=safety_settings)
        
        # --- Start of improved error handling and JSON parsing ---
        print("Full Gemini Response Object:", response) # Debug: Print the whole response object

        # Check if any candidates were generated. If not, it means the generation was blocked.
        if not response.candidates:
            if response.prompt_feedback and response.prompt_feedback.block_reason:
                error_detail = f"Gemini API blocked the prompt due to: {response.prompt_feedback.block_reason.name}. Please modify your input content."
            elif response.candidates and response.candidates[0].finish_reason == 'SAFETY':
                 error_detail = "Gemini API blocked the response due to safety policy. Try different content."
            else:
                error_detail = "Gemini API returned no content candidates. This might be due to an internal error or unknown blocking."
            
            print(f"Gemini generation blocked: {error_detail}")
            raise HTTPException(status_code=500, detail=error_detail)

        response_text_stripped = response.text.strip()
        
        print("Gemini response text (stripped) before parsing:", repr(response_text_stripped)) # Debug

        if not response_text_stripped:
            # This case should ideally be caught by the `if not response.candidates:` check,
            # but serves as a fallback for truly empty content.
            raise HTTPException(
                status_code=500,
                detail="Empty response text received from Gemini after stripping whitespace. This could indicate a generation issue or subtle content filter."
            )
            
        # Attempt to clean up the response text if it includes markdown code blocks
        # This is a common issue where the model might wrap JSON in ```json ... ```
        if response_text_stripped.startswith('```json') and response_text_stripped.endswith('```'):
            response_text_stripped = response_text_stripped[len('```json'):-len('```')].strip()
            print("Cleaned JSON string from markdown block:", repr(response_text_stripped))
        elif response_text_stripped.startswith('```') and response_text_stripped.endswith('```'):
            # In case it's just ``` and not ```json
            response_text_stripped = response_text_stripped[len('```'):-len('```')].strip()
            print("Cleaned JSON string from generic markdown block:", repr(response_text_stripped))

        try:
            # Attempt to parse the (potentially cleaned) response text as JSON
            return json.loads(response_text_stripped)
        except json.JSONDecodeError as e:
            # If JSON parsing fails, provide detailed error including the raw text
            print("Failed to parse JSON:", e)
            print("Raw response text that caused JSON error (after potential markdown strip):", repr(response_text_stripped))
            raise HTTPException(
                status_code=500,
                detail=f"Invalid JSON response from Gemini: {str(e)}. Raw response: {response_text_stripped[:500]}..."
            )
            
    except Exception as e:
        print("Detailed Gemini API call error:", repr(e))
        # Handle exceptions from the google.generativeai library more gracefully
        if hasattr(e, 'status_code') and hasattr(e, 'message'):
            raise HTTPException(status_code=e.status_code, detail=f"Gemini API error: {e.message}")
        
        # Catch other unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during MCQ generation: {str(e)}"
        )

@app.get("/")
def read_root():
    return {"message": "Backend is running fine!"}

@app.post("/generate-mcqs/")
async def generate_mcqs_endpoint(file: UploadFile = File(...),question_count: int = 5):
    try:
        # Validate file size (e.g., max 5MB)
        if file.size > 5 * 1024 * 1024:
            raise HTTPException(400, "File too large (max 5MB)")
            
        # Extract and validate text
        text = extract_text(file)
        if len(text.strip()) < 50: # Minimum 50 characters of text needed
            raise HTTPException(400, "Insufficient text content in the file (minimum 50 characters required).")
            
        
        
        # Generate MCQs
        mcqs = generate_mcqs(text, question_count)
        return {"mcqs": mcqs}
            
    except HTTPException:
        # Re-raise HTTPExceptions as they are already formatted for the client
        raise
    except Exception as e:
        print(f"Unexpected error in MCQ endpoint: {repr(e)}")
        raise HTTPException(500, f"An unexpected processing error occurred: {str(e)}")
