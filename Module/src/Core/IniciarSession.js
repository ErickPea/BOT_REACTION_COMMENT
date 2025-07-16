// IniciarSession.js
import fs from 'fs';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function iniciarSesion(page) {
    try {
        if (fs.existsSync('cookies.json')) {
            const cookies = JSON.parse(fs.readFileSync('cookies.json'));
            await page.setCookie(...cookies);
            console.log('Cookies cargadas.');
        } else {
            console.log('No se encontraron cookies guardadas.');
        }
    } catch {
        console.log('Error cargando cookies.');
    }

    await page.goto('https://www.facebook.com', { timeout: 60000, waitUntil: 'networkidle2' });
    await delay(2000 + Math.random() * 2000);

    if (await page.$('#email')) {
        await page.type('#email', 'erickpena2123@gmail.com', { delay: 100 });
        await delay(1000 + Math.random() * 1000);

        await page.type('#pass', 'Roronazorro212324', { delay: 100 });
        await delay(1000 + Math.random() * 1000);

        await page.click('button[name="login"]');
        console.log('Intentando iniciar sesión con credenciales...');
    }

    try {
        console.log('Esperando que se cargue el feed...');
        await page.waitForSelector('[role="feed"]', { timeout: 10000 });
        console.log('Feed cargado, login exitoso.');

        const cookies = await page.cookies();
        fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
        console.log('Cookies guardadas.');

    } catch (err) {
        console.error('No se detectó el feed en el tiempo esperado. Puede que haya un captcha o validación extra.');
        await delay(10000);
        await page.screenshot({ path: 'login_error.png' });
    }
}