import { Assets, Sprite, Texture, Container, AnimatedSprite, TextureSource, Text, TextStyle } from 'pixi.js';
import { containerResizeSetup } from '../utils/utils';
import { showLoading, hideLoading } from '../utils/loading_screen';
import { Player } from 'textalive-app-api';
TextureSource.defaultOptions.scaleMode = "nearest";

export async function loadLevel(pixiApp, switchTo){
    
    await Assets.loadBundle("fireworks_level");

    const container = new Container();

    const firework_bg = new Sprite(Assets.get("fireworks_bg"));

    pixiApp.stage.addChild(container);
    container.addChild(firework_bg);

    containerResizeSetup(pixiApp, firework_bg, container);
}