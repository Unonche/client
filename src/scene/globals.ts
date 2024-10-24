import { Application } from "pixi.js-legacy";
import type { Hand } from "./hand";
import { Scene } from "./scene";

export const avatars = ['chat','fatigue','jesus','magalax','mickey','pepe','rire','zidane'];
export const cardWidth = 90;
export const cardHeight = 143;

export const self = {
  id: ''
};

export const scene = new Scene();
export const hands: Record<string, Hand> = {};
export const screen: Record<string, boolean> = {
  isMicro: false,
  isMobile: false,
  isHorizontal: false
}
export const colors: Record<string, number> = {
  red: 0xe41212,
  green: 0x13e412,
  blue: 0x1274e4,
  yellow: 0xffe600,
  wild: 0x141414,
}

export const actions = {};

export function loadCardAssets(app: Application) {
  app.loader.add('cardSpritesheet', '/cards-spritesheet.json');
}
