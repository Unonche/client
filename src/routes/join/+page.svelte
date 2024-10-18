<script lang="ts">
import { onMount } from "svelte";
import { focusTrap, getToastStore } from '@skeletonlabs/skeleton';
import { joinRoom } from "../../stores/colyseus";
import AvatarSelector from "../../avatarSelector.svelte";

let avatar: string|null;
let playerName = '';
let roomId: string|null = null;

onMount(() => {
	const url = new URL(window.location.href);
	roomId = url.searchParams.get('room');
});

const toastStore = getToastStore();

$: allowed = /^[-_a-zA-Z0-9]{3,15}$/.test(playerName);

async function join() {
  if (!allowed || !roomId || !avatar) return;
	try {
		await joinRoom(roomId, playerName, avatar);
	} catch (e) {
		toastStore.trigger({
			message: e.message,
			background: 'variant-filled-error',
		});
	}
}
</script>

<div class="p-4 flex items-center justify-center w-full min-h-screen">
  <div class="flex flex-col">
    <img src="logo.png" alt="logo" class="w-auto h-28 mx-auto"/>
	  <header class="card-header font-bold text-center pt-2 text-xl">Rejoindre #{roomId}</header>
	  <form use:focusTrap={true}>
	    <input class="input text-lg my-4" type="text" placeholder="Pseudo" bind:value={playerName} />
      <div class="card max-w-md rounded-lg">
	      <div class="pt-4 font-bold text-center">Choisis ton avatar</div>
	      <div class="p-2"><AvatarSelector bind:avatar={avatar}></AvatarSelector></div>
      </div>
	    <button type="button" class="btn btn-lg mt-4 w-full variant-filled-primary" class:opacity-50={!allowed} class:cursor-not-allowed={!allowed} on:click={join}>Rejoindre la partie</button>
	  </form>
	</div>
</div>
