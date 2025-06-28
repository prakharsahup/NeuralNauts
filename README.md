# City Pulse - Bengaluru Live

City Pulse is an agentic AI application designed to provide a live, synthesized, and intelligent view of the city of Bengaluru. It ingests real-time, user-submitted reports, uses the Google Gemini API to analyze and categorize them, and displays them on an interactive dashboard with a map.

The goal is to transform scattered, raw data points from citizen reports into a clear, actionable, and real-time pulse of the city.

## Features

-   **Live Event Feed**: A real-time feed of events happening across the city, sorted chronologically.
-   **AI-Powered Synthesis**: User reports are automatically processed by Gemini to generate a concise title, a summary, and an appropriate category (`Traffic`, `Civic Issue`, etc.).
-   **Interactive Map**: Events are plotted on a map of Bengaluru, providing a clear geographical context for each report.
-   **Multimodal Reporting**: Users can submit reports with a description and an optional photo, which Gemini analyzes for a more accurate assessment.
-   **Modern & Responsive UI**: A sleek, dark-themed interface that works seamlessly on both desktop and mobile devices.

## Tech Stack

-   **Frontend**: HTML5, CSS3, TypeScript (without any framework)
-   **AI**: Google Gemini API (`@google/genai`) for text and vision analysis.
-   **Development Server**: [Vite](https://vitejs.dev/) for a fast and modern development experience.
-   **Map**: A static image of Bengaluru with markers projected based on latitude and longitude.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or higher) and npm.
-   A valid **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    This command will download all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    The project uses a `.env` file to manage secret keys securely.
    a. Create a new file named `.env` in the root of your project directory.
    b. Copy the contents of `.env.example` into your new `.env` file.
    c. Replace the placeholder with your actual Google Gemini API Key.

    **File: `.env`**
    ```
    VITE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
    *Note: The `.env` file is included in `.gitignore` by default to prevent you from accidentally committing your secret key.*

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open in your browser:**
    Vite will start the server and print a local URL to the terminal (usually `http://localhost:5173`). Open this URL in your web browser to see the City Pulse application running!

The development server provides Hot Module Replacement (HMR), so any changes you make to the source code will be reflected in the browser instantly without a full page reload.
