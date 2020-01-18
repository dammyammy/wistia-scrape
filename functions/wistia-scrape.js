const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer-core')

exports.handler = async (event, context) => {

    const element = JSON.parse(event.body).text;

    if (!element) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Link not defined' })
    }

    // let link = extractWistiaURL(text);

    let imgRegex = /<img[^>]+src="http([^">]+)/g;
    
    let video = {
      title: element.substring(element.lastIndexOf('">') + 1, element.lastIndexOf('</a></p>')).replace('>', ''),
    //   image: imgRegex.exec(element)[0].replace('<img src="', ''),
      embedUrl: "https://fast.wistia.net/embed/iframe/" +element.substring(element.indexOf('?wvideo=') + 1, element.indexOf('">')).replace('wvideo=', '')
    };

    return {
        statusCode: 200,
        body: JSON.stringify({ ...element, ...video })
    }



    const browser = await chromium.puppeteer.launch({ //
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(video.embedUrl, { waitUntil: ["domcontentloaded", 'networkidle2'] })

    const [el] = await page.$x('/html/body/script[4]');
  
    const value = await el.getProperty('textContent');

    let valueTxt = await value.jsonValue();

    let url = (valueTxt.substring(valueTxt.indexOf('"url":"') + 1, valueTxt.indexOf('.bin"')) + '.mp4')
            .replace('url":"', '');

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({ ...video, url })
    }
}


// function extractWistiaURL(link) {
//     let imgRegex = /<img[^>]+src="http([^">]+)/g;
    
//     return {
//       title: link.substring(link.lastIndexOf('">') + 1, link.lastIndexOf('</a></p>')).replace('>', ''),
//       image: imgRegex.exec(link)[0].replace('<img src="', ''),
//       embedUrl: "https://fast.wistia.net/embed/iframe/" +link.substring(link.indexOf('?wvideo=') + 1, link.indexOf('">')).replace('wvideo=', '')
//     };
// }    
