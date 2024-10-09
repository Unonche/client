<svelte:head>
    <title>Unonche</title> 
</svelte:head>

<script lang="ts">
import CreateRoom from '../createRoom.svelte';
import JoinRoom from '../joinRoom.svelte';
import Game from '../game.svelte';
import { room, leaveRoom } from "../stores/colyseus";
import { onDestroy, onMount } from "svelte";

onDestroy(() => {
  leaveRoom();
});

let roomId: string|null = null;

onMount(() => {
	const url = new URL(window.location.href);
	roomId = url.searchParams.get('room');
});

$: joiningRoom = !!roomId && !$room;
$: creatingRoom = !roomId && !$room;
</script>

<div class="w-full h-full">
  {#if creatingRoom}
    <CreateRoom></CreateRoom>
  {:else if joiningRoom}
    <JoinRoom></JoinRoom>
  {:else}
    <Game></Game>
  {/if}
</div>
