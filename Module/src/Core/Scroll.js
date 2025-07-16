// Scroll.js
export async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 200; // Reduje la distancia para que el scroll no baje demasiado
            const maxScrolls = 5; // Limita el número de desplazamientos
            let scrolls = 0;

            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
                scrolls++;

                if (scrolls >= maxScrolls) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}