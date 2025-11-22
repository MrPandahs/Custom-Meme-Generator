// Select popup elements
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const popUpOverlay = document.getElementById('popupOverlay');

// Select buttons and file inputs
const upload = document.getElementById('main-button-two');
const libraryFile = document.getElementById('fileInput');
const submit = document.getElementById('main-button-one');
const refresh = document.getElementById('main-button-three');

// Display containers
const fileContainer = document.getElementById('filePlacement');
const imageContainer = document.getElementById('imageContainer');
const apiStatusMessage = document.getElementById('statusMessage');

// API key input elements
const apiTextInput = document.getElementById('apiKeyInput');
const saveApiButton = document.getElementById('saveApiKey');

let selectedFile = null; // stores uploaded image
let apiKey = null; // stores user API key

// Saves the API key when user clicks the button
saveApiButton.addEventListener('click', function () {
    apiKey = apiTextInput.value.trim();
    console.log("API key has been temporarily saved: ", apiKey);

    if (!apiKey) {
        alert("Please enter a valid API key");
        return;
    }

    apiStatusMessage.textContent = '';
    apiTextInput.value = '';
});

// Function to send a request to Mistral API
async function mistralChat(prompt) {
    if (!apiKey) {
        return "Error: You haven't provided your api key yet! Do that so you can have fun! 😁";
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mistral-small-2506",
            messages: [
                { role: "system", content: "You are a text meme generator. You can only generate one funny sentence per input" },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        return `API Error: ${response.status} - ${errorText}`;
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Initial test prompt
title = mistralChat("You have to create funny text to an image that the user uploads.");

// Upload button opens file picker
upload.addEventListener('click', function () {
    libraryFile.click();
});

// Handle file selection
libraryFile.addEventListener('change', function (event) {
    selectedFile = event.target.files[0];
    if (!selectedFile) return;

    fileContainer.textContent = 'Here is your awesome and beautiful image file: ';
    imageContainer.textContent = '';

    const fileNameSpan = document.createElement('span');
    fileNameSpan.textContent = selectedFile.name;
    fileNameSpan.style.cursor = 'pointer';
    fileNameSpan.style.textDecoration = 'underline';

    // Allow user to click the name to re-upload
    fileNameSpan.addEventListener('click', function () {
        libraryFile.click();
    });

    fileContainer.append(fileNameSpan);
});

// Shows popup when file is missing
function showPopup() {
    popup.style.display = 'block';
    popupOverlay.style.display = 'block';
}


// Close popup button
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
});


function drawMemeImage(imageFile, memeText) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);

        img.onload = () => {
            const canvas = document.getElementById('memeCanvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the original image
            ctx.drawImage(img, 0, 0);

            // TEXT SETTINGS
            const baseSize = img.width * 0.07;
            const fontSize = Math.min(baseSize, 80);
            ctx.font = `${fontSize}px Impact`;

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.lineWidth = Math.max(fontSize / 10, 6);
            ctx.strokeStyle = "black";

            const maxWidth = img.width * 0.85;
            const words = memeText.split(" ");
            const lines = [];

            let line = "";

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


            let y = 20;

            for (let l of lines) {
                ctx.strokeText(l, canvas.width / 2, y);
                ctx.fillText(l, canvas.width / 2, y);
                y += parseInt(ctx.font, 10) + 10; // line spacing
            }

            resolve(canvas.toDataURL());
        };
    });
}

// Submit button: generate meme text
submit.addEventListener('click', async function () {
    if (!selectedFile) {
        showPopup();
        return;
    }

    imageContainer.textContent = '';
    apiStatusMessage.textContent = 'Creating text to your beautiful picture';

    const description = `Create a funny meme text for this file: ${selectedFile.name}`;

    try {
        const memeText = await mistralChat(description);

        apiStatusMessage.textContent = '';

        //Create meme image
        const finalImageURL = await drawMemeImage(selectedFile, memeText);

        const finalImg = document.createElement('img');
        finalImg.src = finalImageURL;
        finalImg.style.width = "500px";

        imageContainer.append(finalImg);

    } catch (error) {
        console.error(error);
        apiStatusMessage.textContent = 'Seems like you got an error :c refresh and try again good sir or madam!';
    }
});


// Refresh button reloads the page
refresh.addEventListener('click', function () {
    location.reload();
});
