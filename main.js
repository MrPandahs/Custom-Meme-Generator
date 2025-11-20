const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');

const upload = document.getElementById('main-button-two');
const libraryFile = document.getElementById('fileInput');
const submit = document.getElementById('main-button-one');
const refresh = document.getElementById('main-button-three');
const fileContainer = document.getElementById('filePlacement');
const imageContainer = document.getElementById('imageContainer');

let selectedFile = null;


function mistralChat(prompt) {
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
        .then(function (data) {
            console.log(data.choices[0].message.content);
        });
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

    fileContainer.style.fontFamily = "Impact, Arial Black, sans-serif";
    fileContainer.style.fontSize = "15px";
    fileContainer.style.color = "white";
    fileContainer.style.textTransform = "uppercase";
    fileContainer.style.textShadow = "2px 2px 0px black, -2px 2px 0px black, 2px -2px 0px black, -2px -2px 0px black";

    const fileNameSpan = document.createElement('span');
    fileNameSpan.textContent = selectedFile.name;
    fileNameSpan.style.cursor = 'pointer';
    fileNameSpan.style.textDecoration = 'underline';
    fileNameSpan.style.color = 'blue';

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
submit.addEventListener('click', function() {
    if (!selectedFile) {
        showPopup();
        return;
    }
    imageContainer.textContent = '';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(selectedFile);
    img.style.width = '500px';

    imageContainer.append(img);
});

refresh.addEventListener('click', function(){
    location.reload();
})