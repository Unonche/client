import { Texture, Graphics, Sprite, Text, TextStyle } from "pixi.js-legacy";

import type { GameObject } from "./gameObject";
import { actions, cardHeight, cardWidth, scene, self } from "./globals";

export interface CardData {
  color: string,
  value: string,
}

export class CardFront extends Sprite implements GameObject {
  constructor(x: number, y: number, angle: number, color: string, value: string, interactive = false) {
    super(Texture.from(color+'.png'));
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
      img = Texture.from('poc.png');
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'luck') {
      img = Texture.from('dice.png');
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    }  else if (value === 'sleep') {
      img = Texture.from('sleep.png');
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'wild') {
      img = Texture.from('wild_icon.png');
    } else if (value === 'draw_two' || value === 'draw_four') {
      const sprite = new Sprite(Texture.from('draw_two.png'));
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'skip') {
      img = Texture.from('skip.png');
      imgScale = 0.5;
      const sprite = new Sprite(img);
      sprite.anchor.set(0.5, 0.5);
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    } else if (value === 'reverse') {
      img = Texture.from('reverse.png');
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
        stroke: '#000000',
        strokeThickness: this.texture.height/30,
        dropShadow: true,
        dropShadowAngle: Math.PI/4,
        dropShadowDistance: bigShadowDistance,
        dropShadowColor: '#000000',
      });
      bigText = new Text(text, bigStyle);
      bigText.anchor.set(0.5, 0.5);
      bigText.x = 0;
      bigText.y = 0;
      this.addChild(bigText);
    }

    // Draw bar under number
    if (bigText && (value === '6' || value === '9')) {
      const bigBar = new Graphics();
      bigBar.lineStyle(this.texture.height/60, 0x000000, 1);
      bigBar.beginFill(0x000000);
      bigBar.drawRoundedRect(
        -bigText.width/2+3 + bigShadowDistance/2,
        bigText.height/5 + bigShadowDistance/2,
        bigText.width/1.4,
        bigText.height/16,
        3,
      );
      bigBar.endFill();
      bigBar.beginFill(0xffffff);
      bigBar.drawRoundedRect(
        -bigText.width/2+3,
        bigText.height/5,
        bigText.width/1.4,
        bigText.height/16,
        3,
      );
      bigBar.endFill();
      this.addChild(bigBar);
    }

    if (img) {
      const offset = 9;
      const smallSprite = new Sprite(img);
      smallSprite.scale.x = imgScale;
      smallSprite.scale.y = imgScale;
      smallSprite.x = -this.texture.width/2+offset;
      smallSprite.y = -this.texture.height/2+offset;
      const smallSpriteReversed = new Sprite(img);
      smallSpriteReversed.scale.x = imgScale;
      smallSpriteReversed.scale.y = imgScale;
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
        stroke: '#000000',
        strokeThickness: this.texture.height/60,
        dropShadow: true,
        dropShadowAngle: Math.PI/4,
        dropShadowDistance: smallShadowDistance,
        dropShadowColor: '#000000',
      });
      const smallText = new Text(text, smallStyle);
      smallText.x = 8-this.width/2;
      smallText.y = 1-this.height/2;
      this.addChild(smallText);

      const smallTextReversed = new Text(text, smallStyle);
      smallTextReversed.rotation = Math.PI;
      smallTextReversed.x = -8+this.width/2;
      smallTextReversed.y = -1+this.height/2;
      this.addChild(smallTextReversed);

      if (bigText && (value === '6' || value === '9')) {
        const smallBar = new Graphics()
        smallBar.lineStyle(this.texture.height / 80, 0x000000);
        smallBar.beginFill(0x000000);
        smallBar.drawRect(
          9 - this.texture.width / 2 + smallShadowDistance / 2,
          0 - this.texture.height / 2 + smallText.height / 1.4 + smallShadowDistance / 2,
          smallText.width / 1.4,
          smallText.height / 16
        );
        smallBar.endFill();

        smallBar.lineStyle(this.texture.height / 80, 0x000000);
        smallBar.beginFill(0xffffff);
        smallBar.drawRect(
          9 - this.texture.width / 2,
          0 - this.texture.height / 2 + smallText.height / 1.4,
          smallText.width / 1.4,
          smallText.height / 16
        );
        smallBar.endFill();
        // .rect(
        //   9-this.texture.width/2 + smallShadowDistance/2,
        //   6-this.texture.height/2+smallText.height/1.2 + smallShadowDistance/2,
        //   smallText.width/1.4,
        //   smallText.height/16,
        // )
        // .stroke({
        //   color: '#000000',
        //   width: this.texture.height/60,
        // })
        // .fill('#000000')
        // .rect(
        //   9-this.texture.width/2,
        //   6-this.texture.height/2+smallText.height/1.2,
        //   smallText.width/1.4,
        //   smallText.height/16,
        // )
        // .stroke({
        //   color: '#000000',
        //   width: this.texture.height/60,
        // })
        // .fill('#ffffff');

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
        if (cardIndex === undefined) return;
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
  constructor(x: number, y: number, angle: number) {
    super(Texture.from('back.png'));
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
