# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b4281170-3446-4c7c-90fc-b92ee16a552a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b4281170-3446-4c7c-90fc-b92ee16a552a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Local Setup Instructions

This project has two main parts:

- **Frontend**: `hello-bliss-bot` (React, Vite, TypeScript)
- **Backend**: `Hello-Bliss-Bot-Backend-DRF` (Django REST Framework)

### Frontend Setup (hello-bliss-bot)

```sh
# Open a terminal and navigate to the frontend folder
cd hello-bliss-bot

# Install dependencies
npm install

# Start the development server
npm run dev
# The app will be available at http://localhost:8080/
```

### Backend Setup (Hello-Bliss-Bot-Backend-DRF)

```powershell
# Open PowerShell and navigate to the backend folder
cd Hello-Bliss-Bot-Backend-DRF

# Create a virtual environment (first time only)
python -m venv venv-windows

# Activate the virtual environment
.\venv-windows\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver 127.0.0.1:8000
# The API will be available at http://127.0.0.1:8000/
```

### Common Issues

- If you see `npm error code ENOENT`, make sure you are in the `hello-bliss-bot` folder when running npm commands.
- For PowerShell venv activation, use `Activate.ps1` (not `Activate.psi`).
- If you see `No module named 'django'`, ensure your venv is activated and dependencies are installed.

---

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b4281170-3446-4c7c-90fc-b92ee16a552a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
