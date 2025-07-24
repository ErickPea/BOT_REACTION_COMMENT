// IniciarSession.js
import fs from 'fs';
import google from '../google/iniciarSession.js';

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
    await page.goto('https://www.youtube.com/', { timeout: 60000, waitUntil: 'networkidle2' });
    await delay(2000 + Math.random() * 2000);



    try{
    // click en el botton acceder en youtube
    await page.waitForSelector('text=Acceder'); // Asegura que el botón está disponible
    // Esperar a que se abra la nueva página al hacer clic en "Acceder"
    const [newPage] = await Promise.all([
        page.context().waitForEvent('page'), // espera que se abra una nueva pestaña
        page.click('text=Acceder'),   // clic en el botón
    ]);

    // Esperar a que la nueva página cargue completamente
    await newPage.waitForLoadState();

    await google.iniciarSesionGoogle(newPage);

    } catch (error) {
        console.log('Error al iniciar sesión en YouTube:', error.message);
    }

    console.log('Nueva pestaña abierta con URL:', newPage.url());

}