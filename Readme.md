# 🧠 MCQ Wizard

An AI-powered web application designed to transform your study materials (PDF or DOCX files) into intelligently generated multiple choice questions. Built for educators, students, and e-learning platforms, it automates question creation using Natural Language Processing techniques.

Transform your study material into **Multiple Choice Questions (MCQs)** in seconds using the power of **Google Gemini AI**.

✅ Upload your notes  
✅ Choose how many questions you want  
✅ Review & edit MCQs  
✅ Download in PDF, DOCX, or TXT format  

> ⚡ Built using React + FastAPI + Gemini API + Python Magic


---


## 📚 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [About Me](#about-me)

---

## 📖 About

The **MCQ Wizard** is a full-stack application that allows users to upload PDF or DOCX files and generate multiple-choice questions using Google’s **Gemini API**. It features a customizable interface for reviewing, editing, and exporting questions.


> ✅ Also check out the [MCQ Generator using spaCy](https://github.com/surendrapattikonda/mcq-generator-1) — a minimal, local version built with Python and spaCy!

---

## ✅ Features

- 📂 **File Upload**:  Upload `.pdf` or `.docx` documents via a React frontend.
- ⚙️ **Customizable Output**:  Specify the number of MCQs to generate (Easy/Medium/Hard).
- 🤖 **AI Integration**:  Utilizes Gemini (Google LLM) through a FastAPI backend to generate quality MCQs.
- 🧩 **MCQ Management UI**:
  - Edit MCQ questions and options.
  - Delete unwanted questions.
  - Mark questions as ✅ OK / ❌ Not OK.
- 💾 **Download Options**: Export MCQs as:
  - 📄 PDF (via `jspdf`)
  - 📃 TXT
  - 📑 DOCX (via `html-docx-js`)
- 🔁 **Real-Time Preview**: Instantly see question updates before download.
- 🛡️ **Robust Backend**: CORS support and error handling in FastAPI ensures smooth communication.

---

## 🛠 Tech Stack  

#### **Frontend**  
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  

#### **Backend & APIs**  
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/) [![Gemini API](https://img.shields.io/badge/Gemini_API-FF6D00?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)  

#### **Tools**  
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" width="30" height="30" title="VSCode" />

---

## ⚙️ Getting Started

### Prerequisites

- Node.js & npm
- Python 3.x
- `pip` for Python packages
- **Google Gemini API key** ([Get your key here](https://aistudio.google.com/app/apikey))


### Installation

#### 🔹1. Clone the Repository

```
git clone https://github.com/surendrapattikonda/mcqwizard
cd mcqwizard
```


#### 🔹2. Setup Backend (FastAPI)

```# Create a virtual environment for isolation
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate


# Install Python dependencies
pip install -r requirements.txt


# Create a .env file in the backend root directory
echo "GOOGLE_API_KEY=your_gemini_api_key_here" > .env


# Run the FastAPI app
uvicorn main:app --reload
```
✅ Ensure your FastAPI backend is running on http://localhost:8000.

#### 🔹3. Frontend Setup (React)

```# cd frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start 
```
Now open http://localhost:3000 🎉


## 🚀 How It Works

#### 1. 🖥️ Start the App
Launch the development server using: 
```bash 
npm run dev
```

#### 2. 📁 Upload Your File  
Upload a PDF or DOCX file containing your source content.

> 🧪 Try uploading your own file and see the magic happen!


#### 3. 🎯 Customize Your Preferences
Choose how many questions to generate .


#### 4. 🤖 Generate with Gemini AI
Gemini AI create MCQs .


#### 5. 🛠️ Review and Edit
Approve ✅, Reject ❌, or Edit 📝 the generated questions on preview page.



#### 6. 📥 Download Your Questions
Export your final MCQs in PDF, DOCX, or TXT format.


📸 For a full walkthrough with screenshots, [click here → Screenshots.md](./screenshots.md)


---


## 📂 Project Structure
<details>
<summary> Project Folder Structure (click to expand)</summary>


```
├── README.md
├── backend/
│ ├── .env
│ ├── main.py
│ └── requirements.txt
│
├── frontend/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── DownloadOption.jsx
│ │ │ ├── FileUpload.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Header.jsx
│ │ │ ├── HeroSection.jsx
│ │ │ ├── MCQPreview.jsx
│ │ │ └── ProcessingSpinner.jsx
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ └── README.md
│
└── Screenshots/
```
</details>

---
## 🚀 Future Enhancements

🔐 Add user authentication to save MCQ history and downloads

🌐 Deploy the app using Vercel (frontend) and Render/Railway (backend)

🧠 Improve distractor generation using advanced NLP techniques

📊 Add an analytics dashboard (e.g., total MCQs generated, usage stats)

🗂️ Enable topic-based question generation from structured notes

🌍 Add multi-language support using Gemini’s multilingual feature

🔁 Implement question regeneration for low-quality questions

---


## 🙋‍♂️ About Me  
Hi, I’m **Pattikonda Surendra** 👋  

🚀 BTech CSE (Data Science) | Full Stack & ML Enthusiast  

🔗 Connect with me:  
- 💼 [LinkedIn](https://www.linkedin.com/in/pattikondasurendra)  
- 🧑‍💻 [GitHub](https://github.com/surendrapattikonda) 

---



⭐ If you found this useful, **give it a star**!  
📢 Contributions and feedback are welcome!




