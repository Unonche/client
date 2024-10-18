<script lang="ts">
import { onMount } from "svelte";
import { focusTrap, getToastStore } from '@skeletonlabs/skeleton';
import { joinRoom, createRoom } from "./stores/colyseus";
import AvatarSelector from "./avatarSelector.svelte";

export let creating = false;
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
async function create() {
  if (!allowed || !avatar) return;
  createRoom(playerName, avatar);
}

async function submit() {
	if (creating) return await create();
	await join();
}
</script>

{#if !creating && !roomId}
	<div class="p-4 flex items-center justify-center w-full min-h-screen">
  	<div class="flex flex-col">
      <span class="px-3 py-1 text-xl font-bold bg-surface-900 rounded-md text-center shadow">Chargement...</span>
		</div>
	</div>
{:else}
	<div class="p-4 flex items-center justify-center w-full min-h-screen">
  	<div class="flex flex-col">
    	<img src="logo.png" alt="logo" class="w-auto h-28 mx-auto"/>
			<header class="card-header font-bold text-center pt-2 text-xl">
    		{#if creating}
	  			Nouvelle partie
				{:else}
	  			Rejoindre #{roomId}
				{/if}
			</header>
	  	<form use:focusTrap={true}>
	    	<input class="input text-lg my-4" type="text" placeholder="Pseudo" bind:value={playerName} />
      	<div class="card max-w-md rounded-lg">
	      	<div class="pt-4 font-bold text-center">Choisis ton avatar</div>
	      	<div class="p-2"><AvatarSelector bind:avatar={avatar}></AvatarSelector></div>
      	</div>
	    	<button type="button" class="btn btn-lg mt-4 w-full variant-filled-primary" class:opacity-50={!allowed} class:cursor-not-allowed={!allowed} on:click={submit}>
    			{#if creating}
    				Créer la partie
					{:else}
	    			Rejoindre la partie
					{/if}
	    	</button>
	  	</form>
		</div>
	</div>
{/if}
