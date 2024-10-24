import { Application, Container, Spritesheet, Texture, type TickerCallback, utils } from "pixi.js-legacy";
import gsap from "gsap";
import { actions, colors, loadCardAssets, scene, screen, self } from "../scene/globals";
import { Deck } from "../scene/deck";
import { UnoncheButton } from "../scene/unonche-button";
import { debounce, sleep } from "$lib/utils";
import { CardBack, CardFront, type CardData } from "./card";
import { Player, type PlayerData } from "./player";
import { Decoration } from "./decoration";
import { ColorSelector } from "./colorSelector";

interface Sound {
  play: CallableFunction;
}

type EventQueueItem = {
  type: string;
  cardData: CardData|null;
  playerId: string;
  data: Record<string, number|string|object>;
}

export class Scene {
  app: Application|null = null;
  mainContainer: Container = new Container();
  disposePile: Container = new Container();
  deck: Deck|null = null;
  unoBtn: UnoncheButton|null = null;
  decoration: Decoration|null = null;
  colorSelector: ColorSelector|null = null;
  players: Map<string, Player> = new Map();
  assets: Record<string, Texture> = {};
  sounds: Record<string, Sound> = {};
  avatarSpritesheet: Spritesheet|null = null;
  started = false;
  inited = false;
  reversed = false;
  eventQueue: EventQueueItem[] = [];
  eventQueueTicker: TickerCallback<Promise<void>>;

  constructor() {
    this.eventQueueTicker = async () => {
      if (!this.app) return;

      if (this.eventQueue.length > 0) {
        this.app.ticker.remove(this.eventQueueTicker);
        await this.execQueue();
        this.app.ticker.add(this.eventQueueTicker);
      }
    }
  }

  get width() {
    if (!this.app) return 0;
    return this.app.screen.width;
  }
  get height() {
    if (!this.app) return 0;
    return this.app.screen.height;
  }
  get playerIds() {
    return Array.from(this.players.keys());
  }

  async loadAssets() {
    const { Sound } = await import("@pixi/sound");

    const font = new FontFace("Quicksand", "url('/fonts/Quicksand-Variable.ttf')", {
      weight: '700'
    });
    scene.app?.loader.add('avatarSpritesheet', '/avatars.json');
    if (scene.app) loadCardAssets(scene.app);

    this.sounds['card'] = Sound.from('/card.mp3');

    await Promise.all([
      font.load(),
      new Promise((resolve) => {
        scene.app?.loader.load(resolve);
      })
    ])

    document.fonts.add(font);
  }

  async init(canvas: HTMLCanvasElement, container: HTMLElement, _selfId: string, _actions: Record<string, CallableFunction>) {
    self.id = _selfId;
    Object.assign(actions, _actions);

    this.reset();

    this.app = new Application({ width: 1080, height: 1080, view: canvas, backgroundAlpha: 0, resizeTo: container, antialias: false, forceCanvas: !utils.isWebGLSupported() });
    this.app.ticker.maxFPS = 30;

    await this.loadAssets();

    if (this.decoration) this.decoration.destroy();
    this.decoration = new Decoration();

    this.app.stage.addChild(this.mainContainer);

    const resize = () => {
      screen.isMobile = window.matchMedia('screen and (max-width: 1400px)').matches || window.matchMedia('screen and (max-height: 768px)').matches;
      screen.isMicro = window.matchMedia('screen and (max-width: 850px)').matches || window.matchMedia('screen and (max-height: 768px)').matches;
      screen.isHorizontal = window.innerWidth > window.innerHeight;
      this.updateAll(false);
    }

    window.addEventListener('resize', debounce(resize, 500));

    resize();

    this.app?.ticker.add(this.eventQueueTicker);

    this.inited = true;
  }

  async start(players: Map<string, PlayerData>, cardsData: CardData[], currentPlayerId: string, turnStartTime: number, deckSize: number, disposedCards: CardData[] = []) {
    if (this.started) return;

    this.disposePile = new Container();
    this.mainContainer.addChild(this.disposePile);

    if (disposedCards.length > 0) {
      for (const cardData of disposedCards) {
        const card = new CardFront((Math.random()-0.5)*20, (Math.random()-0.5)*20, Math.random()-0.5, cardData.color, cardData.value, false);
        this.disposePile.addChild(card);
      }
    }

    this.deck = new Deck(deckSize);
    this.app?.stage.addChild(this.deck);
    this.unoBtn = new UnoncheButton();

    this.players.clear();

    for(const player of players.values()) {
      this.players.set(player.id, new Player(player, players.get(player.id)?.handSize || cardsData.length, self.id === player.id ? cardsData : null));
    }

    this.started = true;
    this.updateAll(false);

    this.players.get(currentPlayerId)?.startTimer(turnStartTime);
  }

  async execQueue() {
    const item = this.eventQueue.shift();
    if (!item || !this.deck) return;

    const { type, cardData, playerId, data } = item;

    if (type === 'draw') {
      const player = this.players.get(playerId);
      if (!player) return;

      let card;
      if (playerId === self.id && cardData) {
        card = new CardFront(this.deck.x, this.deck.y, this.deck.rotation, cardData.color, cardData.value, true);
      } else {
        card = new CardBack(this.deck.x, this.deck.y, this.deck.rotation);
      }

      player.hand.addCard(card);
      this.deck.setDeckSize(this.deck.deckSize-1);
      this.deck.update();
      this.sounds['card']?.play();
    } else if (type === 'play' && cardData) {
      this.playCard(playerId, Number(data['cardIndex']), cardData, String(data['nextColor']));
    }

    if (this.eventQueue.length > 0) {
      await sleep(300);
      await this.execQueue();
    }
  }

  reset() {
    gsap.exportRoot().kill();
    this.decoration?.reset();
    this.disposePile.destroy();
    this.playerIds.forEach(id => this.players.get(id)?.destroy());
    this.players.clear();
    this.deck?.destroy();
    this.unoBtn?.destroy();
    this.started = false;
    this.reversed = false;
  }

  updateAll(animate = true) {
    for (const player of this.players.values()) {
      player.update(animate);
    }

    if (this.disposePile && this.disposePile.transform) {
      this.disposePile.position.x = this.width/2;
      this.disposePile.position.y = this.height/2;
    }
    if (this.decoration) this.decoration.update(this.started);
    if (this.deck) this.deck.update();
    if (this.unoBtn) this.unoBtn.update();
  }

  playCard(playerId: string, cardIndex: number, cardData: CardData, nextColor: string) {
    const player = this.players.get(playerId);
    if (!player) return;

    const existingCard = player.hand.cards[cardIndex];
    if (!existingCard) return;

    player.hand.setFocus(null);
    player.hand.cards.splice(cardIndex, 1);
    player.hand.update();

    const card = new CardFront(existingCard.getGlobalPosition().x-this.disposePile.position.x, existingCard.getGlobalPosition().y-this.disposePile.position.y, existingCard.rotation, cardData.color, cardData.value);
    this.disposePile.addChild(card);

    gsap.to(card, {
      duration: 0.1,
      x: (Math.random()-0.5)*20,
      y: (Math.random()-0.5)*20,
      ease: "power1.inOut",
    });
    gsap.to(card, {
      duration: 0.1,
      rotation: card.rotation+Math.random()-0.5,
      ease: "power1.inOut",
    });
    card.interactive = false;

    existingCard.destroy();

    this.sounds['card']?.play();

    if (cardData.value === 'reverse') this.reversed = !this.reversed;

    const color = cardData.color === 'wild' ? colors[nextColor] : colors[cardData.color];
    if (this.decoration) this.decoration.setColor(color);
    if (this.unoBtn) this.unoBtn.setColor(color);
  }

  // EVENTS

  onPlayCard(playerId: string, cardIndex: number, cardData: CardData, nextColor: string) {
    this.colorSelector?.destroy();

    const player = this.players.get(playerId);
    if (!player) return;

    this.eventQueue.push({ type: 'play', cardData, playerId, data: { cardIndex, nextColor } });
  }
  onChooseColor(cardIndex: number) {
    this.colorSelector?.destroy();
    this.colorSelector = new ColorSelector(cardIndex);
  }
  async onDrawCards(playerId: string, cardsData: CardData[]|null, cardsAmount: number) {
    if (!this.deck) return;

    for (let i = 0; i < cardsAmount; i++) {
      const cardData = cardsData ? cardsData[i] : null;
      this.eventQueue.push({ type: 'draw', cardData, playerId, data: {}});
    }
  }
  onNewTurn(playerId: string, startTime: number) {
    for (const p of this.players.values()) {
      p.stopTimer();
    }

    const player = this.players.get(playerId);
    if (!player) return;
    player.startTimer(startTime);
  }
  onWin() {
    this.reset();
  }
  onEnd() {
    this.reset();
  }
  onPlayersUpdate(players: Map<string, object>) {
    // playersArray.splice(0, playersArray.length);
    // Array.from(players.keys()).forEach((p: string) => playersArray.push(p));
    for (const player of scene.players.values()) {
      if (!Array.from(players.keys()).includes(player.id)) {
        player.destroy();
        scene.players.delete(player.id);
      }
    }
    this.updateAll();
  }
}

