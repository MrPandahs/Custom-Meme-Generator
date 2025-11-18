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
                { role: "system", content: "You are a concise assistant." },
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

mistralChat("Explain recursion in one sentence.")