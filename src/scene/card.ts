import { Graphics, Sprite, Text, TextStyle } from "pixi.js";

import type { GameObject } from "./gameObject";
import { actions, cardHeight, cardSpritesheet, cardWidth, scene, self } from "./globals";

export interface CardData {
  color: string,
  value: string,
}

export class CardFront extends Sprite implements GameObject {
  constructor(x: number, y: number, angle: number, color: string, value: string, interactive = false) {
    super(cardSpritesheet.textures[color+'.png']);
    this.anchor.set(0.5, 0.5);
    this.width = cardWidth;
    this.height = cardHeight;

    const bigShadowDistance = this.texture.height/35;
    const smallShadowDistance = this.texture.height/70;

    let text;

    if (value === 'draw_two') text = '+2';
    else if (value === 'draw_four') text = '+4';
    else text = value.toString()[0];

    let img;
    let imgScale = 1;

    let bigText;
    if (value === 'poc') {
      img = cardSpritesheet.textures['poc.png'];
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'luck') {
      img = cardSpritesheet.textures['dice.png'];
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    }  else if (value === 'sleep') {
      img = cardSpritesheet.textures['sleep.png'];
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'wild') {
      img = cardSpritesheet.textures['wild_icon.png'];
    } else if (value === 'draw_two' || value === 'draw_four') {
      const sprite = new Sprite(cardSpritesheet.textures['draw_two.png']);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'skip') {
      img = cardSpritesheet.textures['skip.png'];
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'reverse') {
      img = cardSpritesheet.textures['reverse.png'];
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value !== 'wild') {
      const bigStyle = new TextStyle({
        fontFamily: 'Quicksand',
        fontWeight: '700',
        fontSize: this.texture.height/3,
        fill: '#ffffff',
        align: 'center',
        stroke: {
          width: this.texture.height/30,
          color: '#000000'
        },
        dropShadow: {
          angle: Math.PI/4,
          distance: bigShadowDistance,
          color: '#000000'
        },
      });
      bigText = new Text({ text, style: bigStyle });
      bigText.anchor.set(0.5, 0.5);
      bigText.x = 0;
      bigText.y = 0;
      this.addChild(bigText);
    }

    // Draw bar under number
    if (bigText && (value === '6' || value === '9')) {
      const bigBar = new Graphics()
      .roundRect(
        -bigText.width/2+3 + bigShadowDistance/2,
        bigText.height/3 + bigShadowDistance/2,
        bigText.width/1.4,
        bigText.height/16,
        3,
      )
      .stroke({
        color: '#000000',
        width: this.texture.height/40,
      })
      .fill('#000000')
      .roundRect(
        -bigText.width/2+3,
        bigText.height/3,
        bigText.width/1.4,
        bigText.height/16,
        3,
      )
      .stroke({
        color: '#000000',
        width: this.texture.height/40,
      })
      .fill('#ffffff');
      this.addChild(bigBar);
    }

    if (img) {
      const offset = 9;
      const smallSprite = new Sprite(img);
      smallSprite.scale = imgScale;
      smallSprite.x = -this.texture.width/2+offset;
      smallSprite.y = -this.texture.height/2+offset;
      const smallSpriteReversed = new Sprite(img);
      smallSpriteReversed.scale = imgScale;
      smallSpriteReversed.x = this.texture.width/2-offset;
      smallSpriteReversed.y = this.texture.height/2-offset;
      smallSpriteReversed.rotation = Math.PI;
      this.addChild(smallSprite);
      this.addChild(smallSpriteReversed);
    } else {
      const smallStyle = new TextStyle({
        fontFamily: 'Quicksand',
        fontWeight: '700',
        fontSize: this.texture.height/7,
        fill: '#ffffff',
        align: 'center',
        stroke: {
          width: this.texture.height/60,
          color: '#000000'
        },
        dropShadow: {
          angle: Math.PI/4,
          distance: smallShadowDistance,
          color: '#000000'
        },
      });
      const smallText = new Text({ text, style: smallStyle });
      smallText.x = 8-this.texture.width/2;
      smallText.y = 6-this.texture.height/2;
      this.addChild(smallText);

      const smallTextReversed = new Text({ text, style: smallStyle });
      smallTextReversed.rotation = Math.PI;
      smallTextReversed.x = -8+this.texture.width/2; // Center in the card
      smallTextReversed.y = -6+this.texture.height/2; // Center in the card
      this.addChild(smallTextReversed);

      if (bigText && (value === '6' || value === '9')) {
        const smallBar = new Graphics()
        .rect(
          9-this.texture.width/2 + smallShadowDistance/2,
          6-this.texture.height/2+smallText.height/1.2 + smallShadowDistance/2,
          smallText.width/1.4,
          smallText.height/16,
        )
        .stroke({
          color: '#000000',
          width: this.texture.height/60,
        })
        .fill('#000000')
        .rect(
          9-this.texture.width/2,
          6-this.texture.height/2+smallText.height/1.2,
          smallText.width/1.4,
          smallText.height/16,
        )
        .stroke({
          color: '#000000',
          width: this.texture.height/60,
        })
        .fill('#ffffff');

        const smallBar2 = smallBar.clone();
        smallBar2.rotation = Math.PI;

        this.addChild(smallBar);
        this.addChild(smallBar2);
      }
    }

    this.x = x;
    this.y = y;
    this.rotation = angle;

    if (interactive) {
      this.interactive = true;
      this.cursor = 'pointer';

      const onHover = () => {
        const cardIndex = scene.players.get(self.id)?.hand.cards.findIndex(c => c === this);
        scene.players.get(self.id)?.hand.setFocus(cardIndex);
        scene.players.get(self.id)?.hand.update();
      }
      const onOut = () => {
        scene.players.get(self.id)?.hand.setFocus(null);
        scene.players.get(self.id)?.hand.update();
      }
      const onClick = () => {
        const cardIndex = scene.players.get(self.id)?.hand.cards.findIndex(c => c === this);

        if (cardIndex !== undefined && cardIndex >= 0) {
          if (color === 'wild') actions.preplayWild(cardIndex);
          else actions.playCard(cardIndex);
        }
      }
      this.on('mouseover', onHover);
      this.on('touchmove', onHover);
      this.on('mouseout', onOut);
      this.on('touchendoutside', onOut);
      this.on('click', onClick);
      this.on('tap', onClick);
    }
  }

  update() {
  }
}

export class CardBack extends Sprite implements GameObject {
  constructor(x, y, angle) {
    super(cardSpritesheet.textures['back.png']);
    this.width = cardWidth;
    this.height = cardHeight;
    this.anchor.set(0.5, 0.5);
    this.x = x;
    this.y = y;
    this.rotation = angle;
  }
  update() {
  }
}
