import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    await page.goto('https://www.facebook.com');
    await delay(2000 + Math.random() * 2000);

    await page.type('#email', '3136418426', { delay: 100 });
    await delay(1000 + Math.random() * 1000);

    await page.type('#pass', 'Roronazorro2123@', { delay: 100 });
    await delay(1000 + Math.random() * 1000);

    await page.click('button[name="login"]');

    try {
        console.log('Esperando que se cargue el feed...');
        await page.waitForSelector('[role="feed"]', { timeout: 120000 });
        console.log('Feed cargado, login exitoso.');
    } catch (err) {
        console.error('No se detectó el feed en el tiempo esperado. Puede que haya un captcha o validación extra.');
        await delay(10000);
        await page.screenshot({ path: 'login_error.png' });
    }

    await delay(3000 + Math.random() * 2000);

    await page.goto('https://www.facebook.com/erickdaniel.penacedeno.5');
    await delay(3000 + Math.random() * 2000);

    // Verificar si el perfil cargó correctamente
    const isProfileLoaded = await page.$('h1');
    if (!isProfileLoaded) {
        console.error('El perfil no cargó correctamente. Abortando.');
        await page.screenshot({ path: 'perfil_error.png' });
        await browser.close();
        return;
    }

    console.log('Perfil cargado correctamente. Realizando scroll...');
    await autoScroll(page);
    await delay(3000);

    try {
        await page.waitForSelector('span[data-ad-rendering-role="like_button"]', { timeout: 10000 });

        await page.evaluate(() => {
            const likeButton = Array.from(document.querySelectorAll('span[data-ad-rendering-role="like_button"]'))
                .find(el => el.textContent.trim() === 'Like');
            if (likeButton) {
                likeButton.click();
                console.log('Like presionado');
            } else {
                console.log('Botón Like no encontrado');
            }
        });

        await delay(2000 + Math.random() * 2000);

        const commentButtonSelector = 'span[data-ad-rendering-role="comment_button"]';
        await page.waitForSelector(commentButtonSelector, { timeout: 10000 });
        await page.click(commentButtonSelector);
        console.log('Botón Comment presionado');

        await delay(2000 + Math.random() * 2000);

        await page.keyboard.type('Jaja es verdad', { delay: 100 });
        await delay(1000);

        await page.keyboard.press('Enter');
        console.log('Comentario enviado');

        await delay(3000);

    } catch (err) {
        console.log('No se encontró el botón Like o Comment después de hacer scroll.', err.message);
    }

    await delay(3000 + Math.random() * 2000);

    await browser.close();
})();
