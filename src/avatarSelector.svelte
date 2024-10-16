<script lang="ts">
import { onMount } from "svelte";
let avatars = ['rire','jesus','magalax','mickey','zidane','fatigue','pepe','chat'];
export let avatar: string|null;

onMount(() => {
  avatar = avatars[Math.floor(Math.random()*avatars.length)]
})
</script>

<div class="flex flex-wrap">
	{#each avatars as a}
	  <div class="w-1/4 p-2">
	    <button class="transition-all hover:scale-100 rounded-full overflow-hidden bg-surface-900 border-4 {avatar === a ? 'border-primary-500' : 'border-surface-800 scale-90'}" on:click={() => avatar = a}><img src={"avatars/"+a+".png"} alt={a}></button>
	  </div>
  {/each}
</div>
