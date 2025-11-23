// ===========================
// ELEMENT SELECTION
// ===========================

// Popup elements
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const popUpOverlay = document.getElementById('popupOverlay');

// Buttons + file input
const upload = document.getElementById('main-button-two');   // Upload button
const libraryFile = document.getElementById('fileInput');     // Hidden file picker
const submit = document.getElementById('main-button-one');    // Submit button
const refresh = document.getElementById('main-button-three'); // Refresh button

// Display containers
const fileContainer = document.getElementById('filePlacement');
const imageContainer = document.getElementById('imageContainer');
const apiStatusMessage = document.getElementById('statusMessage');

// API key controls
const apiTextInput = document.getElementById('apiKeyInput');
const saveApiButton = document.getElementById('saveApiKey');

// Variables to store state
let selectedFile = null; // Stores uploaded image file
let apiKey = null;       // Stores temporary API key


// ===========================
// SAVE API KEY
// ===========================

saveApiButton.addEventListener('click', function () {
    apiKey = apiTextInput.value.trim(); // Read API key
    console.log("API key has been temporarily saved: ", apiKey);

    // Validate key input
    if (!apiKey) {
        alert("Please enter a valid API key");
        return;
    }

    // Clear UI status + input box
    apiStatusMessage.textContent = '';
    apiTextInput.value = '';
});


// ===========================
// MISTRAL API REQUEST
// ===========================

async function mistralChat(prompt) {
    // If no key found, warn user
    if (!apiKey) {
        return "Error: You haven't provided your api key yet! Do that so you can have fun! 😁";
    }

    // Send POST request to Mistral API
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mistral-small-2506",
            messages: [
                // System instructs model to behave like meme generator
                { role: "system", content: "You are a text meme generator. You can only generate one funny sentence per input" },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        })
    });

    // Handle failed API response
    if (!response.ok) {
        const errorText = await response.text();
        return `API Error: ${response.status} - ${errorText}`;
    }

    // Parse JSON and return generated meme text
    const data = await response.json();
    return data.choices[0].message.content;
}

// Quick initial "test" call
title = mistralChat("You have to create funny text to an image that the user uploads.");


// ===========================
// UPLOAD BUTTON → OPEN FILE PICKER
// ===========================

upload.addEventListener('click', function () {
    libraryFile.click();
});


// ===========================
// FILE SELECTION HANDLING
// ===========================

libraryFile.addEventListener('change', function (event) {
    selectedFile = event.target.files[0]; // Store selected file
    if (!selectedFile) return;

    // Reset containers
    fileContainer.textContent = 'Here is your awesome and beautiful image file: ';
    imageContainer.textContent = '';

    // Create clickable file-name element
    const fileNameSpan = document.createElement('span');
    fileNameSpan.textContent = selectedFile.name;
    fileNameSpan.style.cursor = 'pointer';
    fileNameSpan.style.textDecoration = 'underline';

    // If clicked → re-open file picker
    fileNameSpan.addEventListener('click', function () {
        libraryFile.click();
    });

    // Add filename to UI
    fileContainer.append(fileNameSpan);
});


// ===========================
// SHOW POPUP WHEN NO FILE
// ===========================

function showPopup() {
    popup.style.display = 'block';
    popupOverlay.style.display = 'block';
}

// Close popup event
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
});


// ===========================
// DRAW MEME ON CANVAS
// ===========================

function drawMemeImage(imageFile, memeText) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile); // Load uploaded image

        img.onload = () => {
            const canvas = document.getElementById('memeCanvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size to image size
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0);

            // === TEXT STYLE SETTINGS ===
            const baseSize = img.width * 0.07;      // Scale text based on image width
            const fontSize = Math.min(baseSize, 80); // Cap font size at 80px
            ctx.font = `${fontSize}px Impact`;

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            // Outline thickness
            ctx.lineWidth = Math.max(fontSize / 10, 6);
            ctx.strokeStyle = "black";

            // Limit text width so it wraps nicely
            const maxWidth = img.width * 0.85;

            const words = memeText.split(" ");
            const lines = [];
            let line = "";

            // Basic word-wrapping
            for (let w of words) {
                const testLine = line + w + " ";
                if (ctx.measureText(testLine).width > maxWidth) {
                    lines.push(line);
                    line = w + " ";
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            // Draw text line by line
            let y = 20; // Starting vertical position

            for (let l of lines) {
                ctx.strokeText(l, canvas.width / 2, y);
                ctx.fillText(l, canvas.width / 2, y);
                y += parseInt(ctx.font, 10) + 10; // Add spacing
            }

            // Return final meme image as base64 string
            resolve(canvas.toDataURL());
        };
    });
}


// ===========================
// SUBMIT → GENERATE MEME
// ===========================

submit.addEventListener('click', async function () {
    if (!selectedFile) {
        showPopup(); // Warn if no image uploaded
        return;
    }

    imageContainer.textContent = ''; // Clear last meme
    apiStatusMessage.textContent = 'Creating text to your beautiful picture';

    const description = `Create a funny meme text for this file: ${selectedFile.name}`;

    try {
        // Get funny text from API
        const memeText = await mistralChat(description);
        apiStatusMessage.textContent = '';

        // Draw the final meme image
        const finalImageURL = await drawMemeImage(selectedFile, memeText);

        // Display the final meme
        const finalImg = document.createElement('img');
        finalImg.src = finalImageURL;
        finalImg.style.width = "500px";

        imageContainer.append(finalImg);

    } catch (error) {
        console.error(error);
        apiStatusMessage.textContent = 'Seems like you got an error :c refresh and try again good sir or madam!';
    }
});


// ===========================
// REFRESH PAGE
// ===========================

refresh.addEventListener('click', function () {
    location.reload();
});
