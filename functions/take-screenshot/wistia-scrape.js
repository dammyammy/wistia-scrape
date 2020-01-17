const chromium = require('chrome-aws-lambda');


function extractWistiaURL(link) {
    let imgRegex = /<img[^>]+src="http([^">]+)/g;
    
    return {
      title: link.substring(link.lastIndexOf('">') + 1, link.lastIndexOf('</a></p>')).replace('>', ''),
      image: imgRegex.exec(link)[0].replace('<img src="', ''),
      embedUrl: "https://fast.wistia.net/embed/iframe/" +link.substring(link.indexOf('?wvideo=') + 1, link.indexOf('">')).replace('wvideo=', '')
    };
}

exports.handler = async (event, context) => {

    const text = JSON.parse(event.body).text;

    if (!text) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Link not defined' })
    }

    let link = extractWistiaURL(text);

    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(link.embedUrl, { waitUntil: 'networkidle2' })

    const [el] = await page.$x('/html/body/script[4]');
  
    const value = await el.getProperty('textContent');

    let valueTxt = await value.jsonValue();

    url = (valueTxt.substring(valueTxt.indexOf('"url":"') + 1, valueTxt.indexOf('.bin"')) + '.mp4')
            .replace('url":"', '');

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({ ...link, url })
    }
}
