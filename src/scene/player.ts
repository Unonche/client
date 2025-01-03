import { Container, Graphics, Texture, type TickerCallback } from "pixi.js-legacy";

import type { GameObject } from "./gameObject";
import { scene, screen, self } from "./globals";
import { Hand } from "./hand";
import type { CardData } from "./card";

export interface PlayerData {
  id: string;
  handSize: number;
  avatar: string;
}

export class Player extends Container implements GameObject {
  id: string;
  hand: Hand;
  avatarName: string;
  avatar: Container;
  timer: Graphics;
  tickerFn: TickerCallback<this>|undefined;

  constructor(data: PlayerData, handSize: number, cardsData: CardData[]|null) {
    super();
    this.id = data.id;
    this.hand = new Hand(this.id, handSize, cardsData||null);
    this.timer = new Graphics();
    this.addChild(this.timer);
    this.addChild(this.hand);
    this.avatarName = data.avatar;
    this.avatar = this.createAvatar();

    scene.mainContainer.addChild(this);
  }

  createAvatar(): Container {
    const avatarGroup = new Container();
    const texture = Texture.from(this.avatarName+'.png');

    const avatar = new Graphics();
    avatar.beginFill(0x120b18);
    avatar.drawRect(0, 0, texture.width || 100, texture.height || 100);
    avatar.endFill();
    avatar.beginTextureFill({ texture });
    avatar.drawRect(0, 0, texture.width || 100, texture.height || 100);
    avatar.endFill();

    avatar.width = 100;
    avatar.height = 100;

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(avatar.width/2, avatar.height/2, avatar.width/2);
    mask.endFill();

    mask.x = avatar.x;
    mask.y = avatar.y;
    avatar.mask = mask;

    avatarGroup.addChild(mask);
    avatarGroup.addChild(avatar);
    avatarGroup.pivot.set(avatar.width/2, avatar.height/2);
    this.addChild(avatarGroup);
    return avatarGroup;
  }

  getPosition() {
    const selfOffset = screen.isMobile ? -100 : 60;
    const offset = screen.isMobile ? (screen.isMicro ? 40 : -150) : 60;
    const cornerOffset = screen.isMobile ? (screen.isMicro ? 40 : offset+80) : offset;

    let orderedPlayersArray;
    if (scene.playerIds.includes(self.id)) {
      const selfIndex = scene.playerIds.findIndex(p => p === self.id);
      orderedPlayersArray = scene.playerIds.slice(selfIndex, scene.playerIds.length).concat(scene.playerIds.slice(0, selfIndex));
    } else {
      orderedPlayersArray = scene.playerIds;
    }
    const playerI = orderedPlayersArray.findIndex(p => p === this.id);
    const defaultPos = {
      x: 0,
      y: 0,
    }
    if (playerI === 0) return {
      x: scene.width/2,
      y: scene.height-(screen.isMicro && orderedPlayersArray[0] !== self.id ? offset : selfOffset)
    }
    if (screen.isMicro) {
      switch (scene.players.size) {
        case 2:
          return {
            x: scene.width/2,
            y: offset
          }
        case 3:
          if (playerI === 1) return {
            x: cornerOffset,
            y: cornerOffset
          }
          if (playerI === 2) return {
            x: scene.width-cornerOffset,
            y: cornerOffset
          }
          return defaultPos;
      case 4:
        if (playerI === 1) return {
          x: cornerOffset,
          y: cornerOffset
        }
        if (playerI === 2) return {
          x: scene.width/2,
          y: offset
        }
        if (playerI === 3) return {
          x: scene.width-cornerOffset,
          y: cornerOffset
        }
        return defaultPos;
      case 5:
        if (playerI === 1) return {
          x: cornerOffset,
          y: cornerOffset
        }
        if (playerI === 2) return {
          x: (scene.width-2*cornerOffset)*(1/3)+cornerOffset,
          y: offset
        }
        if (playerI === 3) return {
          x: (scene.width-2*cornerOffset)*(2/3)+cornerOffset,
          y: offset
        }
        if (playerI === 4) return {
          x: scene.width-cornerOffset,
          y: cornerOffset
        }
        return defaultPos;
      case 6:
        if (playerI === 1) return {
          x: cornerOffset,
          y: cornerOffset
        }
        if (playerI === 2) return {
          x: (scene.width-2*cornerOffset)*(1/4)+cornerOffset,
          y: offset
        }
        if (playerI === 3) return {
          x: (scene.width-2*cornerOffset)*(2/4)+cornerOffset,
          y: offset
        }
        if (playerI === 4) return {
          x: (scene.width-2*cornerOffset)*(3/4)+cornerOffset,
          y: offset
        }
        if (playerI === 5) return {
          x: scene.width-cornerOffset,
          y: cornerOffset
        }
        return defaultPos;
      }
    }

    switch (scene.players.size) {
      case 2:
        return {
          x: scene.width/2,
          y: offset
        }
      case 3:
        if (playerI === 1) return {
          x: cornerOffset,
          y: cornerOffset
        }
        if (playerI === 2) return {
          x: scene.width-cornerOffset,
          y: cornerOffset
        }
        return defaultPos;
      case 4:
        if (playerI === 1) return {
          x: offset,
          y: scene.height/2
        }
        if (playerI === 2) return {
          x: scene.width/2,
          y: offset
        }
        if (playerI === 3) return {
          x: scene.width-offset,
          y: scene.height/2
        }
        return defaultPos;
      case 5:
        if (screen.isMobile && !screen.isHorizontal) {
          if (playerI === 1) return {
            x: offset,
            y: scene.height * (3/5)
          }
          if (playerI === 2) return {
            x: cornerOffset,
            y: cornerOffset
          }
          if (playerI === 3) return {
            x: scene.width-cornerOffset,
            y: cornerOffset
          }
          if (playerI === 4) return {
            x: scene.width-offset,
            y: scene.height * (3/5)
          }
        }
        if (playerI === 1) return {
          x: offset,
          y: scene.height * (3/5)
        }
        if (playerI === 2) return {
          x: cornerOffset,
          y: cornerOffset
        }
        if (playerI === 3) return {
          x: scene.width-cornerOffset,
          y: cornerOffset
        }
        if (playerI === 4) return {
          x: scene.width-offset,
          y: scene.height * (3/5)
        }
        return defaultPos;
      case 6:
        if (screen.isMobile && !screen.isHorizontal) {
          if (playerI === 1) return {
            x: offset,
            y: scene.height * (3/4)
          }
          if (playerI === 2) return {
            x: offset,
            y: scene.height * (1/6)
          }
          if (playerI === 3) return {
            x: scene.width/2,
            y: offset
          }
          if (playerI === 4) return {
            x: scene.width-offset,
            y: scene.height * (1/6)
          }
          if (playerI === 5) return {
            x: scene.width-offset,
            y: scene.height * (3/4)
          }
        }
        if (playerI === 1) return {
          x: offset,
          y: scene.height * (2/3)
        }
        if (playerI === 2) return {
          x: offset,
          y: offset
        }
        if (playerI === 3) return {
          x: scene.width/2,
          y: offset
        }
        if (playerI === 4) return {
          x: scene.width-offset,
          y: offset
        }
        if (playerI === 5) return {
          x: scene.width-offset,
          y: scene.height * (2/3)
        }
        return defaultPos;

      default:
        return defaultPos;
    }

  }
  getAngle() {
    const playerIndex = scene.playerIds.findIndex(p => p === this.id);
    const selfIndex = scene.playerIds.includes(self.id) ? scene.playerIds.findIndex(p => p === self.id) : 0;
    return 2*Math.PI/scene.players.size*playerIndex-2*Math.PI/scene.players.size*selfIndex+Math.PI/2;
  }

  startTimer(startTime: number) {
    this.tickerFn = () => {
      const radius = this.avatar.width/2+5;
      const pos = this.avatar.position;

      const startAngle = -Math.PI/2;
      const progress = Math.min((Date.now()-startTime)/30000, 1);
      this.timer.clear();

      if (progress >= 1 && this.tickerFn) return scene.app?.ticker.remove(this.tickerFn);

      const endAngle = startAngle+Math.PI*2*(1-progress);

      this.timer.beginFill(0xffffff);
      this.timer.moveTo(pos.x, pos.y);
      this.timer.arc(pos.x, pos.y, radius, startAngle, endAngle);
      this.timer.lineTo(pos.x, pos.y);
      this.timer.endFill();
    }
    scene.app?.ticker.add(this.tickerFn);
  }
  stopTimer() {
    this.timer.clear();
    if (this.tickerFn) scene.app?.ticker.remove(this.tickerFn);
  }

  updateAvatar() {
    const pos = this.getPosition();
    const angle = this.getAngle();

    if (screen.isMobile) {
      this.avatar.width = 50;
      this.avatar.height = 50;
      const sideOffset = this.id === self.id ? -100 : 0;
      const offset = this.id === self.id ? 0 : (screen.isMicro && scene.playerIds.length > 3 ? -60 : 0);
      this.avatar.x = pos.x-Math.cos(angle)*(260+offset)+Math.cos(angle+Math.PI/2)*sideOffset;
      this.avatar.y = pos.y-Math.sin(angle)*(260+offset)+Math.sin(angle+Math.PI/2)*sideOffset;
      if (screen.isMicro) {
        const o = this.id === self.id ? -270 : 0;
        const u = this.id === self.id ? scene.width/2-50 : 0;
        this.avatar.x = pos.x + u;
        this.avatar.y = pos.y + o;
      }
    } else {
      this.avatar.width = 100;
      this.avatar.height = 100;
      this.avatar.x = pos.x;
      this.avatar.y = pos.y;
    }
  }
  update(animate = true) {
    this.updateAvatar();
    this.hand.update(animate);
  }
}

