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

        // let link = extractWistiaURL(text);

        const imgRegex = /<img[^>]+src="([^">]+)/;
        
        let video = {
            title: element.substring(element.lastIndexOf('">') + 1, element.lastIndexOf('</a></p>')).replace('>', ''),
              image: imgRegex.exec(element) !== null? imgRegex.exec(element)[2] : null,
            embedUrl: "https://fast.wistia.net/embed/iframe/" +element.substring(element.indexOf('?wvideo=') + 1, element.indexOf('">')).replace('wvideo=', '')
        };

        const browser = await chromium.puppeteer.launch({ // chromium
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


        if(url === '.mp4') {
            const value2 = await el2.getProperty('textContent');

            let valueTxt2 = await value2.jsonValue();

            url = (valueTxt2.substring(valueTxt2.indexOf('"url":"') + 1, valueTxt2.indexOf('.bin"')) + '.mp4')
                .replace('url":"', '');
        }


        result = { ...video, url }

        // context.succeed(result);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }

    } catch (error) {
        // return context.fail(error);

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


// function extractWistiaURL(link) {
//     let imgRegex = /<img[^>]+src="http([^">]+)/g;
    
//     return {
//       title: link.substring(link.lastIndexOf('">') + 1, link.lastIndexOf('</a></p>')).replace('>', ''),
//       image: imgRegex.exec(link)[0].replace('<img src="', ''),
//       embedUrl: "https://fast.wistia.net/embed/iframe/" +link.substring(link.indexOf('?wvideo=') + 1, link.indexOf('">')).replace('wvideo=', '')
//     };
// }    
