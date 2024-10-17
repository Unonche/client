<script lang="ts">
import { focusTrap } from '@skeletonlabs/skeleton';
import { createRoom } from "./stores/colyseus";
import AvatarSelector from "./avatarSelector.svelte";

let avatar: string|null;
let playerName = '';
$: allowed = /^[-_a-zA-Z0-9]{3,15}$/.test(playerName);

function submit() {
  if (!allowed || !avatar) return;
  createRoom(playerName, avatar);
}
</script>

<div class="p-4 flex items-center justify-center w-full min-h-screen">
  <div class="flex flex-col">
    <img src="logo.png" alt="logo" class="w-auto h-28 mx-auto"/>
	  <header class="card-header font-bold text-center pt-2 text-xl">Nouvelle partie</header>
	  <form use:focusTrap={true}>
	    <input class="input text-lg my-4" type="text" placeholder="Pseudo" bind:value={playerName} />
      <div class="card max-w-md rounded-lg">
	      <div class="pt-4 font-bold text-center">Choisis ton avatar</div>
	      <div class="py-2"><AvatarSelector bind:avatar={avatar}></AvatarSelector></div>
      </div>
	    <button type="button" class="btn btn-lg mt-4 w-full variant-filled-primary" class:opacity-50={!allowed} class:cursor-not-allowed={!allowed} on:click={submit}>Créer la partie</button>
	  </form>
  </div>
</div>
