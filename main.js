import { Application, TextureSource, Assets } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import { init, switchTo } from '/sceneManager.js';
import * as MainMenu from '/levels/menu.js';
import * as SurfLevel from '/levels/surf_level.js';
TextureSource.defaultOptions.scaleMode = 'nearest';

(async() => {
    // initializing the application
    const app = new Application();

    await app.init({
        resizeTo: window,
    });

    app.canvas.style.position = 'absolute';

    document.body.appendChild(app.canvas);

    await Assets.init({manifest : "/manifest.json"});
    await Assets.loadBundle("shared");

    init(app);

    switchTo(SurfLevel);
})();