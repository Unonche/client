import type { GameObject } from "./gameObject";
import { Container, FillGradient, Graphics } from "pixi.js";
import { actions, cardHeight, cardWidth, scene, screen } from "./globals";
import { CardBack } from "./card";

export class Deck extends Container implements GameObject {
  deckSize: number;
  card: CardBack;
  bottom: Graphics;
  angles: Graphics;
  gradientFill: FillGradient;

  constructor(deckSize: number) {
    super();
    this.deckSize = deckSize;

    this.card = new CardBack(0, 0, 0);
    this.card.x = -this.deckSize*0.1;
    this.card.y = -this.deckSize*0.1;
    this.interactive = true;
    this.cursor = 'pointer';

    this.angles = new Graphics();

    this.gradientFill = new FillGradient(0, 58, 8, 50);
    this.gradientFill.addColorStop(0, '#999999');
    this.gradientFill.addColorStop(1, '#cccccc');

    this.bottom = new Graphics().roundRect(0, 0, cardWidth, cardHeight, 8).fill(this.gradientFill);
    this.bottom.x = -cardWidth/2;
    this.bottom.y = -cardHeight/2;

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
    scene.app.stage.addChild(this);
  }

  draw() {
    this.card.x = -this.deckSize*0.1;
    this.card.y = -this.deckSize*0.1;

    this.angles.clear();
    this.angles.poly([
      {x: this.card.x+cardWidth/2-2, y: this.card.y-cardHeight/2+2},
      {x: this.bottom.x+cardWidth-2, y: this.bottom.y+2},
      {x: this.bottom.x+cardWidth-2, y: this.bottom.y+60},
      {x: this.card.x+cardWidth/2-2, y: this.card.y+60-cardHeight/2+2},
    ]).fill(this.gradientFill.gradientStops[1].color).poly([
      {x: this.card.x-cardWidth/2+2, y: this.card.y+cardHeight/2-2},
      {x: this.bottom.x+2, y: this.bottom.y+cardHeight-2},
      {x: this.bottom.x+2, y: this.bottom.y+cardHeight-60},
      {x: this.card.x-cardWidth/2+2, y: this.card.y-60+cardHeight/2-2},
    ]).fill(this.gradientFill.gradientStops[0].color);
  }

  setDeckSize(deckSize: number) {
    this.deckSize = deckSize;
  }

  update() {
    if (!this.position) return;

    this.draw();
    if (screen.isMicro) {
      this.x = scene.width/2 - 126;
      this.y = scene.height/2 - 86;
      this.rotation = Math.PI/4;
    } else {
      if (screen.isHorizontal || scene.playerIds.length <= 3) {
        this.x = scene.width/2 - 186;
        this.y = scene.height/2;
        this.rotation = 0;
      } else {
        this.x = scene.width/2;
        this.y = scene.height/2 + 160;
        this.rotation = Math.PI/2;
      }
    }
    this.alpha = this.deckSize <= 0 ? 0 : 1;
  }
}

