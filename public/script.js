autosize(document.getElementById('text'));

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

            let card = `<div class="card">
                <div class="card-image">
                    <img src="${res.image}" alt="${res.title}">
                </div>
                <div class="card-body">
                    <h1>${res.title}</h1>
                    <div class="card-buttons">
                        <button type="button" onclick="${downloadVideo(res.url)}">Download</button>
                        <button type="button" onclick="${copyEmbed(res.embedUrl)}">Copy Embed</button>
                    </div>
                </div>
            </div>`;
            

            document.getElementById("loading").style.display = 'none';

            document.getElementById('result').insertAdjacentHTML('beforeend', card);
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