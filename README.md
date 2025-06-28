# City Pulse: Bengaluru Live

City Pulse is an agentic AI application that provides a live, synthesized, and intelligent view of a city, using Bengaluru as a model. It transforms scattered, real-time data from citizen reports into a single, clean, and actionable dashboard. Instead of seeing dozens of separate posts about a traffic jam, users see a single, AI-summarized event on an interactive map.

## Key Features

- **Real-time Event Feed:** A live, auto-updating stream of events happening across the city.
- **AI-Powered Synthesis:** Uses the Google Gemini API to analyze user reports (text and images) to generate concise titles, summaries, and categories.
- **Interactive Map:** Visualizes all reported events on a map of Bengaluru with custom markers for different event types.
- **Multimodal Citizen Reporting:** A user-friendly modal allows citizens to submit reports with descriptions and photos.
- **Geolocation:** Automatically captures the user's location for accurate event plotting.
- **Persistent & Real-time Database:** Built with Firebase (Firestore for data, Cloud Storage for images) to store events and update all connected clients in real-time.
- **Responsive Design:** A clean, modern, dark-themed UI that works on both desktop and mobile devices.

## Tech Stack

-   **Frontend:** HTML5, CSS3, TypeScript
-   **AI:** Google Gemini API (`gemini-2.5-flash-preview-04-17`)
-   **Backend & Database:** Firebase (Firestore, Cloud Storage)
-   **Modules:** Native ES Modules with an import map (no bundler required for this setup).

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   A modern web browser that supports ES Modules (Chrome, Firefox, Edge, Safari).
-   A local web server. We recommend using `npx serve` or Python's built-in server.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/city-pulse.git
cd city-pulse
```

### 2. Configure Google Gemini API Key

The application requires a Google Gemini API key to power its AI analysis features.

1.  Go to [Google AI Studio](https://aistudio.google.com/) and create an API key.
2.  Open the `index.tsx` file.
3.  Find the line `const API_KEY = process.env.API_KEY;`. Since this project runs directly in the browser without a build step, `process.env` will not work. You must replace it with your actual key:
    
    ```typescript
    // Replace this:
    const API_KEY = process.env.API_KEY;
    
    // With your key like this:
    const API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; 
    ```
4.  **Important:** Do not commit your API key to a public repository. This method is for local development only.

### 3. Configure Firebase

Firebase is used for the database and image storage.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and create a new Firebase project.
3.  Once your project is created, click the **Web icon (`</>`)** to register a new web app.
4.  Give your app a nickname and click **"Register app"**.
5.  Firebase will provide a `firebaseConfig` object. **Copy this object.**
6.  Open `index.tsx` and paste your copied `firebaseConfig` object into the placeholder:
    
    ```typescript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      // ... paste your entire config object here
    };
    ```
    
7.  **Enable Firestore:**
    -   In the Firebase console, go to **Build > Firestore Database**.
    -   Click **"Create database"**.
    -   Start in **Test mode** (this allows open access for local development). Click **Next**, then **Enable**.
8.  **Enable Firebase Storage:**
    -   In the Firebase console, go to **Build > Storage**.
    -   Click **"Get started"**.
    -   Follow the prompts to set up your storage bucket, using the default settings.

### 4. Run the Application

Because the app uses ES modules, you cannot open the `index.html` file directly in the browser. You must serve it from a local web server.

**Option A: Using Node.js (Recommended)**

If you have Node.js installed, you can use `npx` to run a simple server.

```bash
# From the project's root directory
npx serve
```

It will give you a URL, usually `http://localhost:3000`. Open this in your browser.

**Option B: Using Python**

If you have Python installed, you can use its built-in HTTP server.

```bash
# For Python 3
python3 -m http.server

# For Python 2
python -m SimpleHTTPServer
```

This will typically start a server at `http://localhost:8000`. Open this in your browser.

### 5. Start Reporting!

The application should now be running. Click the `+` button to open the reporting modal, get your location, describe an event, and submit it to see the AI and Firebase work in real-time.
