import { Container } from "pixi.js";
import gsap from "gsap";

import type { GameObject } from "./gameObject";
import { scene, screen, self } from "./globals";
import { CardBack, CardFront, type CardData } from "./card";

export class Hand extends Container implements GameObject {
  playerId: string;
  cards: Container[];
  focusIndex: number|null = null;

  constructor(playerId: string, cardsAmount: number, cardsData: CardData[]|null) {
    super();
    this.playerId = playerId;
    this.cards = [];

    for (let j = 0; j < cardsAmount; j++) {
      if (cardsData) {
        const data = cardsData[j];
        this.addCard(new CardFront(0, 0, 0, data.color, data.value, true));
      } else {
        this.addCard(new CardBack(0, 0, 0));
      }
    }
  }
  addCard(card: CardFront|CardBack) {
    this.cards.push(card);
    this.addChild(card);
    this.update();
  }
  setFocus(cardIndex: number|null) {
    this.focusIndex = cardIndex;
  }
  update(animate = true) {
    const player = scene.players.get(this.playerId);
    if (!player) return;
    const angle = player.getAngle();
    const playerPos = player.getPosition();
    const handX = playerPos.x-Math.cos(angle)*130;
    const handY = playerPos.y-Math.sin(angle)*130;
    const handAngle = angle+Math.PI/2;

    const rotation = angle-Math.PI/2;
    const cardsAmount = this.cards.length;

    for (let j = 0; j < cardsAmount; j++) {
      const focus = this.focusIndex !== null ? (j < this.focusIndex ? 1 : (j > this.focusIndex ? -1 : 0)) : 0;
      const focusOffset = 40*focus;
      let x, y, cardAngle;

      let zIndex = j;

      if (this.playerId === self.id && screen.isMobile && screen.isMicro) {
        const layer = Math.floor(j/10);
        const cardsInLayer = layer < Math.floor(cardsAmount/10) ? 10 : (cardsAmount % 10);
        const i = j % 10;
        const cardsOffset = 380/cardsInLayer*(this.playerId === self.id ? 1 : 0.3);
        x = handX+cardsOffset*i-cardsOffset*(cardsInLayer-1)/2;
        y = handY - 20 - 70*layer;
        cardAngle = 0;
        zIndex = j-layer*100;
      } else {
        const cardsOffset = 380/cardsAmount*(this.playerId === self.id ? 1 : 0.3);
        const focusOffsetUp = this.focusIndex === j ? 30 : 0;
        const arcOffset = (cardsAmount <= 1 ? 1 : (-(j/(cardsAmount-1)*2-1)*(j/(cardsAmount-1)*2-1)+1)) * (this.playerId === self.id ? 40 : 20);
        x = handX-Math.cos(handAngle)*cardsOffset*j+Math.cos(handAngle)*cardsOffset*(cardsAmount-1)/2-Math.cos(angle)*arcOffset+Math.cos(handAngle)*focusOffset-Math.cos(angle)*focusOffsetUp;
        y = handY-Math.sin(handAngle)*cardsOffset*j+Math.sin(handAngle)*cardsOffset*(cardsAmount-1)/2-Math.sin(angle)*arcOffset+Math.sin(handAngle)*focusOffset-Math.sin(angle)*focusOffsetUp;
        let cardAngleRelative = (j-(cardsAmount-1)/2)/10+0.001;
        if (cardAngleRelative < -0.5) cardAngleRelative = -0.5;
        if (cardAngleRelative > 0.5) cardAngleRelative = 0.5;
        cardAngle = rotation+cardAngleRelative;
      }
      const card = this.cards[j];
      card.zIndex = zIndex;
      if (animate) {
        gsap.to(card.position, {
          duration: 0.2,
          x, y,
          ease: "power1.inOut",
        });
        gsap.to(card, {
          duration: 0.2,
          rotation: cardAngle,
          ease: "power1.inOut",
        });
      } else {
        card.position.x = x;
        card.position.y = y;
        card.rotation = cardAngle;
      }
    }
  }
}
