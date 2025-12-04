# 🎓 SmartStudy Assistant

**SmartStudy** is an AI-powered educational platform that transforms static PDF lecture notes into interactive study materials. Built with **Next.js**, **TypeScript**, and **Llama 3.1**, it helps students learn faster by automatically generating summaries, flashcards, quizzes, and revision notes.

![SmartStudy Banner](/public/icon.png)

## ✨ Features

* **📄 PDF Parsing:** Drag-and-drop PDF upload with instant text extraction preview.
* **📝 AI Summaries:** Generates concise, formatted summaries of complex topics.
* **🗂️ Flashcard Generator:** Creates 3D-flippable flashcards for active recall study.
* **❓ Interactive Quizzes:** Auto-generates multiple-choice questions with instant scoring.
* **📖 Revision Notes:** Produces structured bullet-point notes optimized for quick review.
* **💬 Chat with PDF:** Context-aware chatbot that answers questions based *only* on your uploaded document.
* **📥 PDF Export:** Download generated flashcards and summaries as clean, formatted PDFs.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **AI Model:** [Meta Llama 3.1-8B-Instruct](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct) (via Hugging Face API)
* **Icons:** [Lucide React](https://lucide.dev/)
* **PDF Parsing:** `pdf2json`
* **PDF Generation:** `html2pdf.js`
* **AI Client:** OpenAI SDK (configured for Hugging Face endpoints)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* A [Hugging Face Access Token](https://huggingface.co/settings/tokens) (Read permissions)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/smart-study.git](https://github.com/your-username/smart-study.git)
    cd smart-study
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Hugging Face token:
    ```env
    HF_TOKEN=hf_YourKeyHere...
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

```bash
/app
  /api              # Backend API Routes (Server-side logic)
    /chat           # Handling chat context
    /extract        # PDF Text extraction
    /flashcards     # Flashcard generation logic
    /quiz           # Quiz generation logic
    /revision       # Revision notes logic
    /summarize      # Summary logic
  /components       # UI Components
    ChatView.tsx    # Chat Interface
    FlashcardView.tsx # 3D Cards & PDF logic
    Header.tsx      # Navigation
    Hero.tsx        # Landing Page Hero
    QuizView.tsx    # Interactive Quiz
    RevisionView.tsx # Revision Notes Display
    SummaryView.tsx # Markdown Summary Display
    UploadView.tsx  # Drag & Drop + State Management
  layout.tsx        # Global Layout & Metadata
  page.tsx          # Main View Controller (State Lifting)