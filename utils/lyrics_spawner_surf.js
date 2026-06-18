import { Container, Text, Ticker } from "pixi.js";

export class LyricSpawner {
    constructor(app, stageContainer, bg, options = {}){
        this.lyricContainer = new Container();
        this.lyricContainer.x = bg.width;
        stageContainer.addChild(this.lyricContainer);

        this.yMax = options.yMax ?? bg.height; // max y coordinate starts at bottom
        this.yMin = options.yMin ?? bg.height / 2; // min y coordinate starts at top
        this.textSpeed = options.textSpeed ?? 10;
        this.moveSpeed = options.moveSpeed ?? 10;

        // spawn point and target spawn location must always be whole number
        this.spawnPoint = Math.round((this.yMin + this.yMax) / 2); // default spawn in center
        this.spawnTargetPoint = this.spawnPoint;
        this.activeTexts = [];
        this._queue = '';
        this._currentChar = null;

        app.ticker.add(this._update, this);
    }

    say(word) {
        this._queue += word;
    }

    _canSpawnNext() {
        if (this._queue.length === 0) return false;
        if (this._currentChar === null) return true;

        const rightEdge = this._currentChar.x + this._currentChar.width;
        return rightEdge < 0;
    }

    _spawnNext() {
        const char = this._queue[0];
        this._queue = this._queue.slice(1);

        const lyricChar = new Text({
            text: char,
            style: { fontSize: 20 }
        });

        lyricChar.y = this.spawnPoint;
        this.lyricContainer.addChild(lyricChar);

        this._currentChar = lyricChar;
        this.activeTexts.push({ text: lyricChar });
    }

    moveSpawnPointTo(y){
        this.spawnTargetPoint = Math.round(y);
    }

    _update = (ticker) => {
        const dt = ticker.deltaMS / 1000;

        this.moveText(dt);
        this.moveSpawnPoint(dt);

        if (this._canSpawnNext()) {
            this._spawnNext();
        }
    }

    moveText(dt){
        let surivingTexts = [];

        for (const char of this.activeTexts){
            char.text.x -= this.textSpeed * dt;

            const rightEdge = char.text.getGlobalPosition().x + char.text.width;

            if (rightEdge < 0){
                this.lyricContainer.removeChild(char.text);

                // if this is the most recently spawned char, clear the reference
                if (char.text === this._currentChar) {
                    this._currentChar = null;
                }

                char.text.destroy();
            } else {
                surivingTexts.push(char);
            }
        }
        
        this.activeTexts = surivingTexts;
    }

    moveSpawnPoint(dt){
        const gap = this.spawnPoint - this.spawnTargetPoint;

        if (gap === 0) return;

        let direction = Math.sign(gap);
        this.spawnPoint += this.moveSpeed * direction * dt;

        if (this.spawnTargetPoint == Math.round(this.spawnPoint)){
            this.spawnPoint = this.spawnTargetPoint;
        }
    }
}