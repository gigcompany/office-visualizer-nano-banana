## Project Overview

This project is a 3D office renderer and photorealistic office image generator. It aims to create a lightweight and interactive experience for visualizing office spaces. This project will help create a 3D office space from a 2D floor plan. It will also help create photorealistic images of the office space.

## Tech Stack

- React
- Google Nano Banana model (gemini-2.5-flash-lite)
- @google/genai package. Dont use the older package. 
- Tailwind CSS
- Vite

## Image Processing
When the user selects an image of 2d floor plan, the browser should create a local URL for it using URL.createObjectURL(). This URL should be used to display the image on the page. The image should remain in the browser's memory as a File object. A function should convert the image File objects into base64-encoded strings. The base64 strings, along with a text prompt, are to be sent to the Google Generative AI API.

## Building and Running

*   **To install dependencies:** `npm install`
*   **To run the development server:** `npm start`
*   **To build the project for production:** `npm run build`

## Development Conventions

*   **Code Style:** Follow standard React and JavaScript best practices.
*   **Testing:** `npm test`

### Creating 3D Render

The user will upload a 2D floor plan of their office space. The floor plan image may have dimensions of various objects in the office space like cabins, meeting rooms, tables, etc. 

The user will be asked to select various types of design choices like theme (modern, vibrant, etc), brand color, materials (carpet, wall, table tops, ceiling, etc), types of lighting, etc. 

Based on these the project would use Google Nano Banana to generate a 3D render of the office space.

### Creating Photorealistic Images

The app will choose different angles and perspectives to generate photorealistic images of the office space.
It would choose different rooms like cabins, meeting rooms, etc and generate images of them
The user would be asked to select the room they want to generate images of. The user can also choose the different lighting conditions (like day, night, etc). The user can also choose whether they want people to be place inside the images.