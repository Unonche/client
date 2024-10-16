<script lang="ts">
import ButtonBar from "./buttonBar.svelte";
import Chat from "./chat.svelte";
import Players from './players.svelte';
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col card rounded-none w-full h-full">
  <div class="h-auto z-40 px-4 py-2 flex">
    <img src="logo.png" alt="logo" class="w-auto h-8 p-1 mr-auto"/>
    <ButtonBar on:openHelp={() => dispatch('openHelp')}></ButtonBar>
  </div>
  <div class="h-auto px-4">
    <Players></Players>
  </div>
  <Chat></Chat>
</div>
