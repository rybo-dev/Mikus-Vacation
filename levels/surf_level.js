import { Assets, Sprite, Texture, Container, AnimatedSprite, TextureSource, Text, TextStyle } from 'pixi.js';
import { containerResizeSetup } from '../utils/utils';
import { showLoading, hideLoading } from '../utils/loading_screen';
import { Player } from 'textalive-app-api';
import { LyricSpawner } from '../utils/lyrics_spawner_surf';
TextureSource.defaultOptions.scaleMode = "nearest";

let isPlaying = false;

function applyHitArea(sprite){
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';

    sprite.on('pointerdown', () => {sprite.tint = 0xff0000});
    sprite.on('pointerup', () => {sprite.tint = 0xffffff});
}

export async function loadLevel(pixiApp, switchTo) {
    // LOADING SCREEN
    await showLoading(pixiApp);


    // lyric player setup
    const player = new Player({app: {token: "uSneVT2PK899pLnG"}});

    const container = new Container();

    const surf_assets = await Assets.loadBundle("surf_level");

    pixiApp.stage.addChild(container);

    // background image
    const surfbg = new Sprite(surf_assets.surf_bg);
    container.addChild(surfbg);

    // resize function
    const cleanupResize = containerResizeSetup(pixiApp, surfbg, container);

    // UI container
    const uiButtonContainer = new Container();
    uiButtonContainer.position.set(100, 0);
    container.addChild(uiButtonContainer);

    // x button
    const xButton = new Sprite(Assets.get("x_button"));
    xButton.position.set(0, 0);
    applyHitArea(xButton);
    container.addChild(xButton);

    // toggle play button
    const playTexture = Assets.get("play_button");
    const pauseTexture = Assets.get("pause_button");
    const playToggleButton = new Sprite(playTexture);
    applyHitArea(playToggleButton);
    uiButtonContainer.addChild(playToggleButton);

    // stop button
    const stopButton = new Sprite(Assets.get("stop_button"));
    applyHitArea(stopButton);
    stopButton.position.set(16, 0);
    uiButtonContainer.addChild(stopButton);

    const text = new Text({
        text: "lyrics: ",
        style: {
            fontSize: 10
        }
    });
    text.position.set(0, 30);
    container.addChild(text);

    const artist = new Text({
        text: "artist: ",
        style: {
            fontSize: 10
        }
    })
    artist.position.set(0, 50);
    container.addChild(artist);

    const title = new Text({
        text: "title: ",
        style: {
            fontSize: 10
        }
    })
    title.position.set(0, 70);
    container.addChild(title);

    // Lyric Spawner
    const lyricSpawner = new LyricSpawner(pixiApp, container, surfbg, {
        textSpeed: 200,
        moveSpeed: 50
    });

    // animate the word
    const animateWord = function (now, unit) {
        if (unit.contains(now)) {
            text.text = unit.text;
            lyricSpawner.spawnText(unit.text);
        }
    }

    let isVideoReady = false;

    // Player
    player.addListener({
        onAppReady: (app) => {
            if (!app.managed) {
                playToggleButton.on("pointerup", () => {
                    if (!isVideoReady){ return }
                    
                    if (isPlaying){
                        player.video && player.requestPause();
                    } else {
                        player.video && player.requestPlay();
                    }
                })

                stopButton.on("pointerup", () => {
                    if (!isVideoReady){ return }

                    if (isPlaying){
                        player.video && player.requestStop();
                    }
                })
            }

            if (!app.songUrl){
                player.createFromSongUrl("https://piapro.jp/t/E2i3/20251215092113", {
                    video: {
                        beatId: 4827298,
                        chordId: 2963759,
                        repetitiveSegmentId: 3086266,
                    
                        lyricId: 126533,
                        lyricDiffId: 28631
                    },
                });
            } else {
                console.log("url did not load!");
            }
        },

        onVideoReady: (video) => {
            isVideoReady = true;
        },

        onTimerReady: () => {
            artist.text += player.data.song.artist;
            title.text += player.data.song.name;

            let w = player.video.firstChar;

            while(w && w.next){
                w.animate = animateWord;
                w = w.next;
            }

            hideLoading();
        },

        onPlay: () => { 
            isPlaying = true;
            playToggleButton.texture = pauseTexture;
        },
        onPause: () => { 
            isPlaying = false; 
            playToggleButton.texture = playTexture;
        },
        onStop: () => { 
            isPlaying = false;
            playToggleButton.texture = playTexture;
        }

    });

    // wave image
    const wave = new Sprite(surf_assets.wave);
    container.addChild(wave);

    return {
        container,
        update(delta) {},
        destroy() {
            container.destroy({ children: true });
        }
    };
}