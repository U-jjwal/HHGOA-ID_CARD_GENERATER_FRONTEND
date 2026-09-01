# HH Goa 2026 Frame/ID Card Generator - Frontend

This is the frontend client for the **HH Goa 2026 Frame/ID Card Generator**. It allows users to upload a photo, crop it, generate a personalized event ID card or frame, and seamlessly share it.

## 🚀 Features

- **Personalized ID Builder**: Intuitive form interface for users to enter their details and upload a photo.
- **Image Cropping**: Embedded photo cropping capabilities to ensure perfect alignment within the frame.
- **Card Generation**: High-quality export of the HTML DOM to an image using `html-to-image`/`html2canvas`.
- **Viewing & Sharing**: Users get a dedicated, shareable link displaying their final card with optimized viewing experiences.
- **Responsive UI**: Optimized for both mobile and desktop screens.

---

## 🛠️ Tech Stack

- **React 18**
- **Vite** as the fast frontend build tool
- **TypeScript** for type safety
- **React Router v6** for client-side routing
- **React Easy Crop** for the photo cropping UI
- **Axios** for API communication
- **html-to-image** / **html2canvas** for rendering DOM nodes as downloadable images
- **browser-image-compression** & **heic2any** for pre-processing large or iOS-specific image uploads

---

## 📁 Structure

```text
frontend/
├── src/
│   ├── features/     # Feature-based folder structure
│   │   ├── builder-id/     # Forms and logic for ID entry
│   │   ├── frame-editor/   # Crop stage and frame preview
│   │   ├── share/          # Social sharing buttons and utils
│   │   └── upload/         # Photo upload and format conversions
│   ├── pages/        # Application routes (GeneratorPage, CardViewPage)
│   ├── shared/       # Shared assets, API client, utilities, and generic UI components
│   ├── App.tsx       # Root component mapping routes
│   └── main.tsx      # Entry point
├── index.html        # App HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18 or above recommended)
- The backend server must be running to process API requests.

### 1. Environment Variables Setup

Create a `.env` file in the root of the `frontend/` directory:

```env
# URL where your backend API is hosted
VITE_API_URL=http://localhost:5000
```

### 2. Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will run at `http://localhost:5173`.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Type-checks the TypeScript code and builds the app for production in the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Analyzes the codebase using ESLint to ensure code quality.

---

## 🛡️ License

This project is private and for internal use for the HH Goa 2026 event.
