import { Graphics, Sprite } from "pixi.js";
import gsap from "gsap";
import type { GameObject } from "./gameObject";
import { actions, scene, screen } from "./globals";

export class UnoncheButton extends Sprite implements GameObject {
  sprite: Sprite;
  circle: Graphics = new Graphics();
  lastColor = '#ffffff';
  circleAlpha = 0.5;
  circleHoverAlpha = 0.7;
  circleRadius = 60;

  constructor() {
    super();

    this.sprite = new Sprite(scene.assets['unonchebtn']);
    this.sprite.scale = 0.5;

    this.sprite.anchor.set(0.5, 0.5);
    this.anchor.set(0.5, 0.5);

    this.interactive = true;
    this.cursor = 'pointer';
    this.alpha = this.circleAlpha;

    this.on('mouseover', () => {
      gsap.to(this, {
        duration: 0.15,
        alpha: this.circleHoverAlpha,
        ease: "power1.inOut",
      });
    });
    this.on('mouseout', () => {
      gsap.to(this, {
        duration: 0.15,
        alpha: this.circleAlpha,
        ease: "power1.inOut",
      });
    });

    this.on('click', () => {
      actions.sayUno();
    });
    this.on('tap', () => {
      actions.sayUno();
    });

    this.update();

    this.addChild(this.circle);
    this.addChild(this.sprite);
    scene.app.stage.addChild(this);
  }

  setColor(color: string) {
    this.lastColor = color;
    this.sprite.tint = color;
    this.drawCircle();
  }

  drawCircle() {
    this.circle.clear();
    this.circle.circle(0, 0, this.circleRadius).fill('#120b18').stroke({
      color: this.lastColor, width: 3
    });
  }

  update() {
    if (!this.position) return;

    if ((screen.isHorizontal || scene.playerIds.length <= 3) && !screen.isMicro) {
      this.x = scene.width/2+200;
      this.y = scene.height/2;
    } else {
      this.x = scene.width/2;
      this.y = scene.height/2-190;
    }
    this.drawCircle();
  }
}

