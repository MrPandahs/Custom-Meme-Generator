const upload = document.getElementById('main-button-two');
const submit = document.getElementById('main-button-one');
const refresh = document.getElementById('main-button-three');


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
                { role: "system", content: "You are a meme generator" },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        })
    })
        .then(function(data) {
            console.log(data.choices[0].message.content);
        });
}

mistralChat("You have to create funny text on an image that the user uploads.")

upload.addEventListener('click', function () {

})
