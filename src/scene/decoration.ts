import type { GameObject } from "./gameObject";
import { Container, Graphics, Sprite, type TickerCallback } from "pixi.js-legacy";
import { scene } from "./globals";

export class Decoration extends Container implements GameObject {
  spiral: Sprite = new Sprite();
  spiralFn: TickerCallback<Sprite>;
  colorIndicator: Sprite = new Sprite();
  table: Graphics = new Graphics();
  lastColor = 0xffffff;

  constructor() {
    super();

    this.spiralFn = (deltaTime) => {
        this.spiral.rotation += (scene.reversed ? -0.003 : 0.003) * deltaTime;
    }

    this.initSpiral();
    this.initColorIndicator();
    this.initTable();

    this.update();
    scene.app?.stage.addChild(this);
  }

  initSpiral() {
    this.spiral = Sprite.from('/spiral.png');
    this.spiral.anchor.set(0.5, 0.5);

    this.addChild(this.spiral);

    scene.app?.ticker.add(this.spiralFn);
  }
  initColorIndicator() {
    this.colorIndicator = Sprite.from('/radialgradient.png');
    this.colorIndicator.width = 900;
    this.colorIndicator.height = 900;
    this.colorIndicator.anchor.set(0.5, 0.5);
    this.colorIndicator.alpha = 0.7;
    this.addChild(this.colorIndicator);
  }
  initTable() {
    this.table.x = 0;
    this.table.y = 0;
    this.table.alpha = 0.7;
    this.addChild(this.table);
  }

  drawTable() {
    this.table.clear();
    this.table.lineStyle(3, this.lastColor, 1);
    this.table.beginFill(0x120b18);
    this.table.drawCircle(scene.width/2, scene.height/2, 120);
    this.table.endFill();
  }

  setColor(color: number) {
    this.lastColor = color;
    this.spiral.tint = color;
    this.colorIndicator.tint = color;
    this.drawTable();
  }

  reset() {
    this.setColor(0xffffff);
    this.table.clear();
  }

  update(playing = false) {
    const max = Math.max(scene.width, scene.height);
    this.colorIndicator.x = scene.width/2;
    this.colorIndicator.y = scene.height/2;
    this.spiral.width = max*1.6;
    this.spiral.height = max*1.6;
    this.spiral.x = scene.width/2;
    this.spiral.y = scene.height/2;
    if (playing) {
      this.drawTable();
    } else {
      this.table.clear();
    }
  }
}


