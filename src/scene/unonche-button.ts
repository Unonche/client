import { Sprite } from "pixi.js";
import type { GameObject } from "./gameObject";
import { actions, scene } from "./globals";

export class UnoncheButton extends Sprite implements GameObject {
  constructor() {
    super(scene.assets['unonchebtn']);

    this.scale = 0.5;

    this.anchor.set(1, 1);

    this.interactive = true;

    this.on('mousedown', () => {
      this.setPressing();
    });
    this.on('mouseup', () => {
      this.setDefault();
    });
    this.on('mouseout', () => {
      this.setDefault();
    });

    this.on('click', () => {
      actions.sayUno();
    });

    this.update();

    scene.app.stage.addChild(this);
  }

  setPressing() {
    this.texture = scene.assets['unonchebtnpress'];
  }
  setDefault() {
    this.texture = scene.assets['unonchebtn'];
  }

  update() {
    if (!this.position) return;

    this.x = scene.width/2+240;
    this.y = scene.height/2+150/2;
  }
}

