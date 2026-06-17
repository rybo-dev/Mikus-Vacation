export function containerResizeSetup(app, bg, container){
    //gets the natural width of the background image
    const bgNaturalWidth = bg.width;
    const bgNaturalHeight = bg.height;

    function resize() {
        // computes the amount of scale needed to scale up the container
        const scaleX = app.screen.width / bgNaturalWidth; 
        const scaleY = app.screen.height / bgNaturalHeight;
        const scale = Math.min(scaleX, scaleY); //min for full display of image, max for filled window

        container.scale.set(scale);
        container.x = (app.screen.width - bgNaturalWidth * scale) / 2;
        container.y = (app.screen.height - bgNaturalHeight * scale) / 2;
    }

    resize();

    const onResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        resize();
    };

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
}

