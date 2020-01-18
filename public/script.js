autosize(document.getElementById('text'));

let key = 1;

document.querySelector('button[type="submit"]').addEventListener('click', (e) => {

    e.preventDefault();

    const text = document.getElementById('text').value.trim();

    if (!text) return document.getElementById('result').textContent = 'Please enter Copied Link from Wistia';

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ text: text })
    };

    document.getElementById("loading").style.display = 'block';


    fetch("/.netlify/functions/wistia-scrape", options)
        .then((res) => res.json())
        .then((res) => {

            console.log(res)


            let card = `<div class="card" id="wistia-video-${key}">

                <div class="card-image">
                    <span>#${key}</span>
                    <img src="${res.image}" alt="${res.title}" width="200">
                </div>
                <div class="card-body">
                    <p>${res.title}</p>
                    <div class="card-buttons">
                        <button type="button" data-url="${res.url}">Download</button>
                        <button type="button" data-url="${res.embedUrl}">Copy Embed</button>
                    </div>
                </div>
            </div>`;
            

            document.getElementById("loading").style.display = 'none';

            document.getElementById('result').insertAdjacentHTML('beforeend', card);

            let buttons = document.querySelectorAll('#wistia-video-' +key + ' button');

            buttons[0].addEventListener('click', () => downloadVideo(buttons[0].getAttribute('data-url')))
            buttons[1].addEventListener('click', () => copyEmbed(buttons[1].getAttribute('data-url')))

            key++
        })
        .catch((err) => {
            console.log(err)
            document.getElementById('result').textContent = `Error: ${err.toString()}`
        });
});

function downloadVideo(url) {
    console.log('Downloading ' + url)
}

function copyEmbed(url) {
    console.log('Copied embed code to clipboard' + url)
}