# Image Upload App

This is an image upload app I built using **Next.js**, **React**, **Tailwind CSS**, and **Cloudinary**. It's deployed on **Vercel**.

## Tech Stack

- **Next.js** – Used for routing and server-side rendering.
- **React** – For building the app's UI.
- **Tailwind CSS** – Used for styling the app, it makes styling super quick with utility classes.
- **Cloudinary** – Used for handling the image uploads, storage, and delivery.
- **Vercel** – Deployed the app here for easy hosting and fast deployments.

## Features

- **Drag-and-Drop Upload**: You can drag your images into the upload box or click to select them. You can upload up to 5 images at once.
- **Upload Progress**: Displays the upload progress for each image.
- **Error Handling**: If something goes wrong during the upload, an error message shows up.
- **Automatic Redirect**: After uploading, you’re automatically redirected to a gallery page after a few seconds (I didn't include the URL here because it's for personal use by the client).

## How it Works

- **Uploading**: When a file is dropped or selected, it gets sent to the server via **`FormData`** using the **Fetch API**. The server then uploads the image to Cloudinary.
- **Progress**: The app tracks how much of the image has been uploaded and updates the progress bar accordingly.
- **Success**: After the upload is complete, the app shows a success message and redirects to the gallery page after a few seconds.

## Note

The app is hosted for personal use by the client, so I haven’t included the URL. However, I tested everything with mockup images, and it works as expected.

## How to Run Locally

1. Clone the repo.
2. Install the dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Open the app in your browser at `http://localhost:3000`.
