// bot.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { autoScroll } from '../Core/Scroll.js';
import { iniciarSesion } from '../Core/IniciarSession.js';
import { interactuarConPerfil } from '../Core/Interaccion.js';

puppeteer.use(StealthPlugin());

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    await iniciarSesion(page);
 
    const exito = await interactuarConPerfil(page, 'https://www.facebook.com/erickdaniel.penacedeno.5');
   

    if (!exito) {
        console.error('Falló la interacción con el perfil.');
    }

    await delay(3000 + Math.random() * 2000);

    await browser.close();
})();
