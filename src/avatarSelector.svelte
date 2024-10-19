<script lang="ts">
import { onMount } from "svelte";
import { avatars } from "./scene/globals"
export let avatar: string|null;

onMount(() => {
  avatar = avatars[Math.floor(Math.random()*avatars.length)]
})
</script>

<div class="flex flex-wrap">
	{#each avatars as a, i}
	  <div class="w-1/4 flex items-center justify-center">
	    <button class="shrink-0 transition-all box-content hover:scale-90 rounded-full overflow-hidden bg-surface-900 border-4 {avatar === a ? 'border-primary-500 scale-90' : 'border-surface-800 scale-75'}" on:click={() => avatar = a}
	      style="width:100px; height:100px; background-image: url('avatars.png'); background-position: {-i*100}px 0;"
	    ></button>
	  </div>
  {/each}
</div>
