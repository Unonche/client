import { Assets, Spritesheet, Texture } from "pixi.js";
import type { Hand } from "./hand";
import { Scene } from "./scene";
import atlasData from "../cards-spritesheet.json";

export const avatars = ['boomer','chat','fatigue','jesus','magalax','michelblanc','mickey','notready','pepe','rire','trapvador','zidane'];
export const cardWidth = 90;
export const cardHeight = 143;

export const self = {
  id: ''
};

export const scene = new Scene();
export let cardSpritesheet: Spritesheet;
export const hands: Record<string, Hand> = {};
export const screen: Record<string, boolean> = {
  isMicro: false,
  isMobile: false,
  isHorizontal: false
}
export const colors: Record<string, string> = {
  red: '#e41212',
  green: '#13e412',
  blue: '#1274e4',
  yellow: '#ffe600',
  wild: '#141414',
}

export const actions = {};

export async function loadCardAssets() {
  if (cardSpritesheet) return;

  await Assets.load([
    '/'+atlasData.meta.image
  ]);

  cardSpritesheet = new Spritesheet(
    Texture.from('/'+atlasData.meta.image),
    atlasData
  );

  await cardSpritesheet.parse();
}
