
    export async function  iniciarSesionGoogle(newPage)  {
    // ingreso de datos de acceso
    if (await newPage.$('input[type="email"]')) {
        await newPage.type('#email', 'estoesunapruebajuan112001@gmail.com', { delay: 100 });
        await delay(1000 + Math.random() * 1000);
        if(await newPage.click('text=Siguiente')) {
            console.log('Botón Siguiente presionado');
            if(await newPage.$('input[type="password"]')) {
                await newPage.type('input[type="password"]', 'pruebajuan', { delay: 100 });
                await delay(1000 + Math.random() * 1000);
                await newPage.click('text=Siguiente');
                console.log('Botón Siguiente presionado para contraseña');

            }
        }
    }
}