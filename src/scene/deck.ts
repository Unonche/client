import type { GameObject } from "./gameObject";
import { Container, Graphics, RenderTexture, Sprite } from "pixi.js-legacy";
import { actions, cardHeight, cardWidth, scene, screen } from "./globals";
import { CardBack } from "./card";

export class Deck extends Container implements GameObject {
  deckSize: number;
  card: CardBack;
  bottom: Sprite;
  angles: Graphics;
  // gradientFill: FillGradient;

  constructor(deckSize: number) {
    super();
    this.deckSize = deckSize;

    this.card = new CardBack(0, 0, 0);
    this.card.x = -this.deckSize*0.1;
    this.card.y = -this.deckSize*0.1;
    this.interactive = true;
    this.cursor = 'pointer';

    this.angles = new Graphics();

    // const gradientTexture = RenderTexture.create({ width: 200, height: 200 });
    // const gradient = dkcdok.context.createLinearGradient(0, 0, 0, 200);
    // gradient.addColorStop(0, `#${(gradientColor1).toString(16).padStart(6, '0')}`);
    // gradient.addColorStop(1, `#${(gradientColor2).toString(16).padStart(6, '0')}`);
    // this.gradientFill = new FillGradient(0, 58, 8, 50);
    // this.gradientFill.addColorStop(0, '#999999');
    // this.gradientFill.addColorStop(1, '#cccccc');

    this.bottom = Sprite.from('deckbottom.png');
    this.bottom.x = -cardWidth/2;
    this.bottom.y = -cardHeight/2;

    // g.beginFill(gradientTexture);
    // g.drawRect(0, 0, 200, 200);
    // g.endFill();

    this.update();

    this.on('click', () => {
      actions.drawCard();
    });
    this.on('tap', () => {
      actions.drawCard();
    });

    this.addChild(this.bottom);
    this.addChild(this.angles);
    this.addChild(this.card);
  }

  draw() {
    this.card.x = -this.deckSize*0.1;
    this.card.y = -this.deckSize*0.1;

    this.angles.clear();
    this.angles.lineStyle(0);
    this.angles.beginFill(0xCCCCCC, 1);
    this.angles.drawPolygon([
      {x: this.card.x+cardWidth/2-2, y: this.card.y-cardHeight/2+2},
      {x: this.bottom.x+cardWidth-2, y: this.bottom.y+2},
      {x: this.bottom.x+cardWidth-2, y: this.bottom.y+60},
      {x: this.card.x+cardWidth/2-2, y: this.card.y+60-cardHeight/2+2},
    ]);
    this.angles.endFill();
    this.angles.beginFill(0x999999, 1);
    this.angles.drawPolygon([
      {x: this.card.x-cardWidth/2+2, y: this.card.y+cardHeight/2-2},
      {x: this.bottom.x+2, y: this.bottom.y+cardHeight-2},
      {x: this.bottom.x+2, y: this.bottom.y+cardHeight-60},
      {x: this.card.x-cardWidth/2+2, y: this.card.y-60+cardHeight/2-2},
    ]);
    this.angles.endFill();
  }

  setDeckSize(deckSize: number) {
    this.deckSize = deckSize;
  }

  update() {
    if (!this.transform) return;

    this.draw();
    if (screen.isHorizontal || scene.playerIds.length <= 3) {
      this.x = scene.width/2 - 186;
      this.y = scene.height/2;
      this.rotation = 0;
    } else {
      this.x = scene.width/2;
      this.y = scene.height/2 + 160;
      this.rotation = Math.PI/2;
    }
    this.alpha = this.deckSize <= 0 ? 0 : 1;
  }
}

