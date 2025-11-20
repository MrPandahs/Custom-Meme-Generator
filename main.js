const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');

const upload = document.getElementById('main-button-two');
const libraryFile = document.getElementById('fileInput');
const submit = document.getElementById('main-button-one');
const refresh = document.getElementById('main-button-three');
const fileContainer = document.getElementById('filePlacement');
const imageContainer = document.getElementById('imageContainer');

let selectedFile = null;


async function mistralChat(prompt) {
    return fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_API_KEY",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mistral-medium-2508",
            messages: [
                {role: "system", content: "You are a text meme generator"},
                {role: "user", content: prompt}
            ],
            temperature: 0.7,
            max_tokens: 1000
        })
    })
     const data = await response.json();
    return data.choices[0].message.content;

}

mistralChat("You have to create funny text to an image that the user uploads.")

upload.addEventListener('click', function () {
    libraryFile.click();

});

libraryFile.addEventListener('change', function (event) {
     selectedFile = event.target.files[0];
    if (!selectedFile) return;

    fileContainer.textContent = 'Here is your awesome and beautiful image file: ';
    imageContainer.textContent = '';


    const fileNameSpan = document.createElement('span');
    fileNameSpan.textContent = selectedFile.name;
    fileNameSpan.style.cursor = 'pointer';
    fileNameSpan.style.textDecoration = 'underline';


    fileNameSpan.addEventListener('click', function() {
        libraryFile.click();
    });
    fileContainer.append(fileNameSpan);
});

function showPopup() {
    popup.style.display = 'block';
}

// Close button
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});
submit.addEventListener('click', async function() {
    if (!selectedFile) {
        showPopup();
        return;
    }
    imageContainer.textContent = '';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(selectedFile);
    img.style.width = '500px';
    imageContainer.append(img);

    const description = `Describe this image and create a funny meme text for it: ${selectedFile.name}`;
    const memeText = await mistralChat(description);

    const textDiv = document.createElement('div');
    textDiv.textContent = memeText;
    textDiv.style.marginTop = '20px';
    textDiv.style.fontFamily = 'Impact, Arial Black, sans-serif';
    textDiv.style.fontSize = '24px';
    textDiv.style.color = 'white';
    textDiv.style.textShadow = '2px 2px 0 black';
    textDiv.style.textAlign = 'center';
    imageContainer.append(textDiv);
});

refresh.addEventListener('click', function(){
    location.reload();
})