<script>
import { gameState } from "./stores/colyseus";
import { avatars } from "./scene/globals"
</script>

<div class="h-full flex flex-col py-2 bg-surface-700 rounded-lg overflow-auto" style="max-height: 297px;">
  <span class="text-center text-sm mb-2">{$gameState.players.size}/6 kheys connectés</span>
  <ul>
    {#each $gameState.players.values() as player}
      <li class:border-primary-200={player.id === $gameState.currentPlayerId} class:border-transparent={player.id !== $gameState.currentPlayerId} class:bg-primary-800={player.id === $gameState.currentPlayerId} class="border-l-2 px-4 py-1 flex items-center">
        <div style="width: 28px; height: 28px;" class="relative inline-block mr-2 shrink-0 overflow-hidden">
          <div class:grayscale={player.spectator} class="rounded-full bg-surface-900"
            style="transform: scale(0.28); transform-origin: 0 0; width:100px; height:100px; background-image: url('avatars.png'); background-position: {-avatars.indexOf(player.avatar)*100}px 0;"
          ></div>
        </div>
        <span class:text-slate-500={player.spectator} class:text-primary-200={!player.spectator} class="truncate text-sm">{player.name}</span>

        {#if player.spectator}
          <span class="badge-icon variant-filled ml-1 z-10 shrink-0" style="background: rgba(255, 255, 255, 0.2); padding: 3px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" class="size-6">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
            </svg>
          </span>
        {/if}
        {#if $gameState.kingPlayerId === player.id}
          <span class="badge-icon ml-1 z-10 p-1 shrink-0" style="background: rgba(200, 200, 50, 0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path fill="#fbbf24" d="M576 136c0 22.09-17.91 40-40 40c-.248 0-.4551-.1266-.7031-.1305l-50.52 277.9C482 468.9 468.8 480 453.3 480H122.7c-15.46 0-28.72-11.06-31.48-26.27L40.71 175.9C40.46 175.9 40.25 176 39.1 176c-22.09 0-40-17.91-40-40S17.91 96 39.1 96s40 17.91 40 40c0 8.998-3.521 16.89-8.537 23.57l89.63 71.7c15.91 12.73 39.5 7.544 48.61-10.68l57.6-115.2C255.1 98.34 247.1 86.34 247.1 72C247.1 49.91 265.9 32 288 32s39.1 17.91 39.1 40c0 14.34-7.963 26.34-19.3 33.4l57.6 115.2c9.111 18.22 32.71 23.4 48.61 10.68l89.63-71.7C499.5 152.9 496 144.1 496 136C496 113.9 513.9 96 536 96S576 113.9 576 136z"/></svg>
          </span>
        {/if}

        {#if !player.spectator && $gameState.playing}
          <span class="text-sm ml-auto pl-1" style="white-space: nowrap;">{player.handSize} carte{player.handSize > 1 ? 's' : ''}</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>

