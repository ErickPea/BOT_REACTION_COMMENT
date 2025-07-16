// Interaccion.js
import { autoScroll } from './Scroll.js';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function interactuarConPerfil(page, url) {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await delay(3000 + Math.random() * 2000);

    const isProfileLoaded = await page.$('h1');
    if (!isProfileLoaded) {
        console.error('El perfil no cargó correctamente. Abortando.');
        await page.screenshot({ path: 'perfil_error.png' });
        return false;
    }

    console.log('Perfil cargado correctamente. Realizando scroll...');
    await autoScroll(page);
    await delay(3000);

    try {
        await page.evaluate(() => {
            const likeButton = Array.from(document.querySelectorAll('span[data-ad-rendering-role]'))
                .find(el => el.getAttribute('data-ad-rendering-role')?.includes('me gusta') || ['Like', 'Me gusta'].includes(el.textContent.trim()));
            if (likeButton) {
                likeButton.click();
                console.log('Me gusta presionado');
            } else {
                console.log('Botón Me gusta no encontrado');
            }
        });

        await delay(2000 + Math.random() * 2000);

        await page.evaluate(() => {
            const commentButton = Array.from(document.querySelectorAll('span[data-ad-rendering-role]'))
                .find(el => el.getAttribute('data-ad-rendering-role')?.includes('comment_button') || ['Comment', 'Comentar'].includes(el.textContent.trim()));
            if (commentButton) {
                commentButton.click();
                console.log('Botón Comentar presionado');
            } else {
                console.log('Botón Comentar no encontrado');
            }
        });

        await delay(2000 + Math.random() * 2000);

        await page.keyboard.type('Jaja es verdad', { delay: 100 });
        await delay(1000);

        await page.keyboard.press('Enter');
        console.log('Comentario enviado');

        await delay(3000);

    } catch (err) {
        console.log('No se encontró el botón Me gusta o Comentar después de hacer scroll.', err.message);
    }

    return true;
}