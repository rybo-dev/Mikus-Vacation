import { Assets, Sprite, Container, AnimatedSprite, Polygon, Graphics, TextureSource } from 'pixi.js';
import {initDevtools} from '@pixi/devtools';
import { containerResizeSetup } from '/utils/utils.js'
TextureSource.defaultOptions.scaleMode = 'nearest';
const debug = false; // debug toggle

const animaitionSpeed = 0.03;

let isDay = true; // day night toggle

// bubble pins' hit area setup. shaping the clickable area for the bubble pins
const bubblePolygon = [
    11, 1,
    21, 1,
    25, 6,
    25, 13,
    20, 19,
    16, 30,
    12, 20,
    7, 13,
    7, 6
];

// hit area setup and scene switcher helper function
function applyHitArea(sprite){
    sprite.eventMode = 'static';
    sprite.hitArea = new Polygon(bubblePolygon);
    sprite.cursor = 'pointer';

    if (debug){ // debug stuff ****REMOVE ON FINAL*****
            const g = new Graphics()
                .poly(bubblePolygon)
                .stroke({ width: 2, color: 0xff0000 });

            sprite.addChild(g);
    }

    sprite.on('pointerdown', () => {sprite.tint = 0xff0000});
    sprite.on('pointerup', () => {sprite.tint = 0xffffff});
}

// *********MAIN FUNCTION***********
export async function loadLevel(app, switchTo) {
    // loading in the assets
    await Assets.init({manifest : "/manifest.json"});

    const menuAssets = await Assets.loadBundle("main_menu");

    // creating the container for the main menu
    const container = new Container();
    app.stage.addChild(container);

    // initializing the main menu background
    const menubg = new Sprite(menuAssets.menu_bg);
    const menuNightbg = new Sprite(menuAssets.menu_night_bg);

    // adding the menu background to the menu container
    container.addChild(menuNightbg);
    container.addChild(menubg);
    menubg.visible = isDay;

    const cleanupResize = containerResizeSetup(app, menubg, container);


    // *********BUBBLE SETUP***********

    // Camera bubble set up
    const cameraBubble = new AnimatedSprite(menuAssets.camera_bubble.animations.idle);
    cameraBubble.position.set(103, 47);
    cameraBubble.animationSpeed = animaitionSpeed;
    cameraBubble.play();
    applyHitArea(cameraBubble);
    cameraBubble.visible = isDay;
    container.addChild(cameraBubble);

    // Wave bubble set up
    const waveBubble = new AnimatedSprite(menuAssets.wave_bubble.animations.idle);
    waveBubble.position.set(174, 86);
    waveBubble.animationSpeed = animaitionSpeed;
    waveBubble.play();
    applyHitArea(waveBubble);
    waveBubble.visible = isDay;
    container.addChild(waveBubble);

    // Sunflower Bubble set up
    const sunflowerBubble = new AnimatedSprite(menuAssets.sunflower_bubble.animations.idle);
    sunflowerBubble.position.set(366, 82);
    sunflowerBubble.animationSpeed = animaitionSpeed;
    sunflowerBubble.play();
    applyHitArea(sunflowerBubble);
    sunflowerBubble.visible = isDay;
    container.addChild(sunflowerBubble);

    // Meteor bubble set up
    const meteorBubble = new AnimatedSprite(menuAssets.meteor_bubble.animations.idle);
    meteorBubble.position.set(365, 50);
    meteorBubble.animationSpeed = animaitionSpeed;
    meteorBubble.play();
    applyHitArea(meteorBubble);
    meteorBubble.visible = !isDay;
    container.addChild(meteorBubble);

    // Fireworks bubble set up
    const fireworksBubble = new AnimatedSprite(menuAssets.fireworks_bubble.animations.idle);
    fireworksBubble.position.set(221, 119);
    fireworksBubble.animationSpeed = animaitionSpeed;
    fireworksBubble.play();
    applyHitArea(fireworksBubble);
    fireworksBubble.visible = !isDay;
    container.addChild(fireworksBubble);

    // Bus bubbble set up
    const busBubble = new AnimatedSprite(menuAssets.bus_bubble.animations.idle);
    busBubble.position.set(44, 147);
    busBubble.animationSpeed = animaitionSpeed;
    busBubble.play();
    applyHitArea(busBubble);
    busBubble.visible = isDay;
    container.addChild(busBubble);

    return {
        container,
        update(delta) {},
        destroy() {
            container.destroy({ children: true });
        }
    };
}