document.querySelector('button[type="submit"]').addEventListener('click', (e) => {

    e.preventDefault();

    const text = document.getElementById('text').value;

    if (!text) return document.getElementById('result').textContent = 'Please enter Copied Link from Wistia';

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ text: text })
    };

    document.getElementById('result').textContent = "Please wait..."

    fetch("/.netlify/functions/wistia-scrape", options)
        .then((res) => res.json())
        .then((res) => {


            console.log(res)



            
            // if (!res.buffer) return document.getElementById('result').textContent = 'Error capturing screenshot';

            // const img = document.createElement('img');
            // img.src = bufferToImageUrl(res.buffer.data);
            document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(res) + '</pre>' ;
        })
        .catch((err) => {
            console.log(err)
            document.getElementById('result').textContent = `Error: ${err.toString()}`
        });
});