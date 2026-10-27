# Quick Notes — Full Stack Note-taking App

A responsive note-taking web application built with Node.js, Express, HTML, CSS, and vanilla JavaScript. The frontend uses asynchronous `fetch()` requests to communicate with REST API endpoints.

## Features

- Create notes with a title and content
- View all saved notes
- Delete notes
- Responsive layout for desktop and mobile
- Input validation and user-friendly messages
- JSON file storage for this learning project

## Tech stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js and Express
- Storage: local JSON file (`data/notes.json`)

## Run locally

1. Install Node.js 18 or later.
2. Open a terminal in this project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000`.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notes` | Return all notes |
| POST | `/notes` | Create a note; JSON body: `{ "title": "...", "content": "..." }` |
| DELETE | `/notes/:id` | Delete a note by its ID |

## Deploy to Render

1. Push this project to a GitHub repository.
2. Sign in to Render and choose **New + → Web Service**.
3. Connect the GitHub repository.
4. Use these settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Create Web Service** and wait for deployment.
6. Open the live URL Render provides and test creating and deleting notes.

**Storage note:** The included JSON file is suitable for a simple assignment demo, but file changes on many hosted platforms may not persist across redeploys or restarts. For durable production storage, use a database such as PostgreSQL or a persistent disk. Check your hosting provider's current storage rules.

## Submission proof

Submit both:
- GitHub repository URL
- Deployed live application URL (for example, the Render URL)
