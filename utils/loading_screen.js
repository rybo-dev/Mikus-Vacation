import { Assets, Container, Sprite } from "pixi.js";
import { containerResizeSetup } from "./utils";

let loadingContainer = null;
let cleanupResize = null;

export async function showLoading(app) {
    await Assets.loadBundle("loadingScreen");

    const loadingScreen = new Sprite(Assets.get("loadingSc"));

    loadingContainer = new Container();
    loadingContainer.addChild(loadingScreen);
    loadingContainer.zIndex = 10;

    app.stage.sortableChildren = true;
    app.stage.addChild(loadingContainer);

    cleanupResize = containerResizeSetup(app, loadingScreen, loadingContainer); 
}

export function hideLoading(){
    if (!loadingContainer) { return; }

    cleanupResize?.(); // 👈 remove the listener before destroying
    cleanupResize = null;

    loadingContainer.destroy();
    loadingContainer = null;
}