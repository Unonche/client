<svelte:head>
    <title>Unonche</title> 
</svelte:head>

<script lang="ts">
import Home from '../home.svelte';
import CreateRoom from '../createRoom.svelte';
import JoinRoom from '../joinRoom.svelte';
import Game from '../game.svelte';
import { room, leaveRoom } from "../stores/colyseus";
import { onDestroy, onMount } from "svelte";
import { goto } from "$app/navigation";

onDestroy(() => {
  leaveRoom();
});

let roomId: string|null = null;

onMount(() => {
	const url = new URL(window.location.href);
	roomId = url.searchParams.get('room');
});
</script>

<div class="p-4 flex items-center justify-center w-full min-h-screen">
  <div class="w-full md:w-2/4 lg:w-1/4 flex flex-col">
    <img src="logo.png" alt="logo" class="w-auto h-28 mx-auto"/>
	  <a href="/play?room=onche"><button type="button" class="btn btn-lg mt-4 w-full variant-filled-primary">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
      </span>
	    <span>Jouer</span>
	  </button></a>
	  <a href="/new"><button type="button" class="btn btn-md mt-4 w-full bg-primary-700">
	    <span>
	      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
	    </span>
	    <span>Créer une partie</span>
	  </button></a>
  </div>
</div>
