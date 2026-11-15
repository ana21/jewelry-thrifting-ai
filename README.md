# jewelry-thrifting-ai
AI-assisted jewelry identification and evaluation using a structured, step-by-step expert workflow.

## Why We Built Jewelry Thrifting AI

Jewelry Thrifting AI is based on the workflow of Kelsey Olive, who grew up in her parents’ secondhand store and has been thrifting for 30 years. She scans a store for about 60 seconds, picks a piece that catches her eye, and follows a consistent set of steps to assess it. We turned those steps into guided questions shoppers can use right in the store.

When we tried using Google Images and Gemini directly, we searched one photo at a time and often ended up in a long exchange of details and follow-up questions. We designed the app so shoppers can add photos of the same piece, including close-ups of hallmarks or stones, without starting over. The app sends the photos and answers to Gemini together and requests a short report with a possible identification, the clues behind it, and an estimated resale range when comparable sales are available.

## Run the App Locally

The app has a React frontend and a Node.js server. These steps use a terminal on Ubuntu or another Unix-like system.

### Requirements
- Git, Node.js and npm. The current frontend dependencies require Node.js ^20.19.0, ^22.13.0, or >=23.5.0. Check with node --version and npm --version.
- A Gemini API key for a Google Cloud project with access to gemini-3.8-flash. Create or obtain a key in Google AI Studio. API availability, quota, and charges depend on the project.

### 1. Clone and install
```bash
git clone https://github.com/ana21/jewelry-thrifting-ai.git
cd jewelry-thrifting-ai
cd server
npm ci
cd ../frontend
npm ci
cd ..
```

If you already have the repository, start from its root and install the dependencies in server and frontend.

### 2. Configure the API key
Check that Git ignores the server's environment file:
```bash
git check-ignore -v server/.env
```
Create the file on the machine running the server:
```bash
nano server/.env
```
Add the following line with your own key and save it. Do not commit or share the key.
```
GEMINI_API_KEY=your_api_key_here
```
In nano, press Ctrl+O, Enter, and Ctrl+X to save and exit.

### 3. Start the server
Run this from the repository root and leave it running:
```bash
cd server
node server.mjs
```
The server listens on ```127.0.0.1:3001```. In a separate terminal on the same machine, check its health:
```bash
curl http://127.0.0.1:3001/api/health
```
The expected response is ```{"status":"ok"}```. This checks the local server, not the Gemini connection.

### 4. Start the frontend
In another terminal, from the repository root:
```bash
cd frontend
npm run dev
```
Open the local URL printed by Vite, typically ```http://localhost:5173/```, on the machine running Vite. Vite forwards ```/api``` requests to the server on port 3001. Keep both processes running while using the app. Stop either process with Ctrl+C in its terminal.

If Ubuntu is accessed over SSH and the browser is on the SSH client, create a tunnel from the client, substituting your Ubuntu username and address:
```bash
ssh -L 5173:127.0.0.1:5173 YOUR_UBUNTU_USERNAME@YOUR_UBUNTU_ADDRESS
```
Keep the SSH session open and visit ```http://localhost:5173/``` in a browser on that SSH client. If Vite selects another port, use that port on both sides of the tunnel.

### 5. Try an assessment
Add one to three photos of the same item, enter an asking price, answer the questions, and select Assess jewelry. The server accepts JPEG, PNG, WebP, HEIC, and HEIF images up to 4 MB each. Leave the server terminal visible to see any errors.

The health check does not verify API access. A ```429``` response may indicate quota or rate limits, and a ```503``` may indicate temporary model demand. Check the server output and the project's Google AI Studio usage and limits.

### Current prototype behavior
- Gemini receives the photos, asking price, and answers and returns a tentative assessment.
- Google Search grounding is currently commented out in server/server.mjs. The application does not currently provide a Google Images or Lens visual-search integration.
- The server currently returns an unavailable resale range. Comparable sold prices and source verification are not implemented.
- Information entered in the app is held in the browser session and is cleared when the page is refreshed.
