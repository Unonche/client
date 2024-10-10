<script lang="ts">
import { onMount } from 'svelte';
import { getToastStore, clipboard } from '@skeletonlabs/skeleton';
import { scene } from "./scene/globals";
import { room, gameState, addDefaultListeners, getNonSpectatorPlayers } from "./stores/colyseus";
import { isHelpOpen } from './stores/store';
import Win from './win.svelte';
import { confetti } from "@tsparticles/confetti";

let container:HTMLElement;
let el:HTMLCanvasElement;

let winnerName = '';
let showWin = false;

const toastStore = getToastStore();

const actions = {
  playCard(cardIndex: number, nextColor: string = 'red') {
    $room.send("play_card", { cardIndex, nextColor });
  },
  drawCard() {
    $room.send("draw_card");
  },
  sayUno() {
    $room.send("say_uno");
  },
  preplayWild(cardIndex: number) {
    $room.send("preplay_wild", { cardIndex });
  },
  startGame() {
    $room.send("start");
  }
}

onMount(async () => {
  if (!$room) return;

  await scene.init(el, container, $room.sessionId, actions);
  $room.removeAllListeners();
  addDefaultListeners($room);

  $room.onLeave(() => {
		toastStore.trigger({
			message: 'Déconnecté de la partie',
			background: 'variant-filled-error',
		});
		gameState.set(null);
		room.set(null);
  });

  $room.onMessage("play_card", async (message) => {
    scene.onPlayCard(message.playerId, message.cardIndex, message.card, message.nextColor);
  });

  $room.onMessage("new_turn", (message) => {
    scene.onNewTurn(message.playerId, message.startTime);
  });

  $room.onMessage("choose_color", async (message) => {
    scene.onChooseColor(message.cardIndex);
  });

  $room.onMessage("draw", async (message) => {
    await scene.onDrawCards(message.playerId, message.cards, message.cardsAmount);
  });

  $room.onMessage("win", (message) => {
    scene.onWin();
    const player = $gameState.players.get(message.playerId);
    if (!player) return;

    if (player.id === $room.sessionId) {
      confetti({
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.95,
        startVelocity: 30,
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
        particleCount: 100,
        origin: { x: 0.5, y: 0.5 },
        scalar: 1.2,
        shapes: ['star']
      });
    }

    winnerName = player.name;
    showWin = true;

    setTimeout(() => {
      winnerName = '';
      showWin = false;
    }, 8000);
  });

  $room.onMessage("end", () => {
    scene.onEnd();
  });

  $room.onMessage("start", async (message) => {
    $isHelpOpen = false;
    await scene.start(getNonSpectatorPlayers(), message.cards, message.currentPlayerId, message.turnStartTime, message.deckSize);
  });

  $room.onMessage("players_update", async (message) => {
    if ($gameState.playing) scene.onPlayersUpdate(getNonSpectatorPlayers(message.players));
  });

  if ($gameState.playing) {
    await scene.start(getNonSpectatorPlayers(), $gameState.players.get($room.sessionId).hand, $gameState.currentPlayerId, $gameState.turnStartTime, $gameState.deckSize, $gameState.discardPile);
  }
});

let copyingLink = false;
function onClipboard() {
  copyingLink = true;
  setTimeout(() => copyingLink = false, 3000);
}
</script>

<div bind:this={container} class="w-full h-full" style="max-height: 100%">
  <canvas bind:this={el} class="w-full h-full"></canvas>
</div>
{#if !$gameState.playing}
  <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
    {#if showWin}
      <Win bind:playerName={winnerName}></Win>
    {:else}
      <div class="p-4 flex flex-col items-center">
        <img src="logo.png" alt="logo" class="w-3/4 py-4"/>
        {#if $gameState.players.size < 2}
          <span class="px-3 py-1 text-red-500 mb-2 font-bold bg-surface-900 rounded-md">Il faut au moins 2 joueurs pour commencer une partie</span>
        {/if}
        <div class="w-full md:w-2/4 bg-surface-900 rounded-md text-center p-4 mb-2">
          <div class="font-bold mb-2">Invitez des joueurs avec ce lien:</div>
          <div class="flex">
            <div class="card w-full items-center justify-center text-sm px-4 py-2 mr-2 overflow-hidden" style="text-overflow:ellipsis;white-space:nowrap;">{window.location}</div>
            <button use:clipboard={window.location} on:click={onClipboard} class="btn-icon btn-icon-sm variant-filled rounded-lg shrink-0">
              {#if copyingLink}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                </svg>
              {/if}
            </button>
          </div>
        </div>
        <button class="btn variant-filled mb-2 w-full md:w-2/4" on:click={() => $isHelpOpen = true}>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </span>
          <span>Lire le guide</span>
        </button>
        {#if $room.sessionId === $gameState.kingPlayerId}
          <button class="btn variant-filled w-full md:w-2/4" class:opacity-50={$gameState.players.size < 2} class:cursor-not-allowed={$gameState.players.size < 2} on:click={actions.startGame}>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
            </span>
            <span>Commencer la partie</span>
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}
