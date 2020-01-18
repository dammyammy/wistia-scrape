const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
    let result = null;
    let browser = null;
  
    try {
        const element = JSON.parse(event.body).text;

        if (!element) return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Link not defined' })
        }

        let video = extractWistiaURL(element);

        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        await page.goto(video.embedUrl, { waitUntil: ["domcontentloaded", 'networkidle2'] })

        let url = await getWistiaDownloadUrl(page, '/html/body/script[4]');

        url = url !== '.mp4' ?  url : await getWistiaDownloadUrl(page, '/html/body/script[5]');

        result = { ...video, url }

        // context.succeed(result);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }

    } catch (error) {
        return context.fail(error);

        return {
            statusCode: 400,
            body: JSON.stringify({ error })
        }
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

}

async function getWistiaDownloadUrl(page, xpath) {
    let [el] = await page.$x(xpath);
        
    const value = await el.getProperty('textContent');

    let valueTxt = await value.jsonValue();

    return (valueTxt.substring(valueTxt.indexOf('"url":"') + 1, valueTxt.indexOf('.bin"')) + '.mp4')
            .replace('url":"', '');
}


function extractWistiaURL(element) {
    let imgRegex = /<img[^>]+src="([^">]+)/;

    return {
        title: element.substring(element.lastIndexOf('">') + 1, element.lastIndexOf('</a></p>')).replace('>', ''),
        embedUrl: "https://fast.wistia.net/embed/iframe/" +element.substring(element.indexOf('?wvideo=') + 1, element.indexOf('">')).replace('wvideo=', ''),
        image: imgRegex.exec(element) !== null ? imgRegex.exec(element)[1] : null
    };
}    
