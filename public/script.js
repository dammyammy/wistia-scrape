let textElement = document.getElementById('text')

autosize(textElement);

let key = 1;

document.querySelector('button[type="submit"]').addEventListener('click', (e) => {

    e.preventDefault();

    const text = textElement.value.trim();

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
            let card = `<div class="card" id="wistia-video-${key}">

                <div class="card-image">
                    <span>#${key}</span>
                    <img src="${res.image}" alt="${res.title}" width="200">
                </div>
                <div class="card-body">
                    <p>${res.title}</p>
                    <div class="card-buttons">

                        <a target="_blank" type="button" href="${res.url}">Download</button>
                        <button class="link" type="button" data-url="${res.url}">Copy</button>
                        <button class="link" type="button" data-url="${res.embedUrl}">Copy Embed</button>
                    </div>
                </div>
            </div>`;
            

            document.getElementById("loading").style.display = 'none';

            document.getElementById('result').insertAdjacentHTML('beforeend', card);

            let buttons = document.querySelectorAll('#wistia-video-' +key + ' button');

            textElement.value = '';

            buttons[0].addEventListener('click', () => copyEmbed(res.url))
            buttons[1].addEventListener('click', () => copyEmbed(res.embedUrl))

            key++
        })
        .catch((err) => {
            console.log(err)
            document.getElementById('result').textContent = `Error: ${err.toString()}`
        });
});



function copyEmbed(url) {

    if('clipboard' in window.navigator) {
        window.navigator.clipboard.writeText(url)

        alert('Copied embed code to clipboard ' + url);

        return;
    }

    alert('Error copying to clipboard');
}

// function downloadVideo(url, title) {
//     console.log('Downloading ' + url)

//     saveURLFile(url, createSlug(title) + '.mp4', 'video/mp4')
// }


// async function saveURLFile(url, filename, mimeType, bom) {

//     // let blob = await urlToBlob(url, mimeType, bom);

//     let blob = window.URL.createObjectURL(
//         new Blob([url], { type: mimeType })
//     )

//     if (typeof window.navigator.msSaveBlob !== 'undefined') {
//         // IE workaround for "HTML7007: One or more blob URLs were
//         // revoked by closing the blob for which they were created.
//         // These URLs will no longer resolve as the data backing
//         // the URL has been freed."
//         window.navigator.msSaveBlob(blob, filename);
//     }
//     else {
//         // let blobURL = window.URL.createObjectURL(blob);

//         let tempLink = document.createElement('a');
//         tempLink.style.display = 'none';
//         tempLink.href = blobURL;
//         tempLink.setAttribute('download', filename);

//         // Safari thinks _blank anchor are pop ups. We only want to set _blank
//         // target if the browser does not support the HTML5 download attribute.
//         // This allows you to download files in desktop safari if pop up blocking
//         // is enabled.
//         if (typeof tempLink.download === 'undefined') {
//             tempLink.setAttribute('target', '_blank');
//         }

//         document.body.appendChild(tempLink);
//         tempLink.click();

//         // Fixes "webkit blob resource error 1"
//         setTimeout(function() {
//             document.body.removeChild(tempLink);
//             window.URL.revokeObjectURL(blobURL);
//         }, 0)
//     }
// }

// async function urlToBlob(url, mimeType, bom = undefined) {
//     let {data} = await axios({
//         url,
//         method: 'GET',
//         responseType: 'blob', // important
//     });

//     return new Blob(
//         (typeof bom !== 'undefined') ? [bom, data] : [data],
//         { type: mimeType || 'application/octet-stream' }
//     );
// }


// function createSlug(str) {
//     str = str.replace(/^\s+|\s+$/g, ""); // trim
//     str = str.toLowerCase();

//     // remove accents, swap ñ for n, etc
//     const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
//     const to = "aaaaaaeeeeiiiioooouuuunc------";

//     let i = 0, l = from.length;
//     for (; i < l; i++) {
//         str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
//     }

//     str = str
//         .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
//         .replace(/\s+/g, "-") // collapse whitespace and replace by -
//         .replace(/-+/g, "-") // collapse dashes
//         .replace(/^-+/, "") // trim - from start of text
//         .replace(/-+$/, ""); // trim - from end of text

//     return str;
// }
