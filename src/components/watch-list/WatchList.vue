<template src="./WatchList.template.html"></template>
  
<script setup>
import { useTvShowStore } from "../../store/tvShowStore";
import { computed } from "vue";

import ShowCard from "../show-card/ShowCard.vue";
import NavigationMenu from "../navigation-menu/NavigationMenu.vue";

const store = useTvShowStore();

const watchListShows = computed(() => store.watchList);

const recommendedShows = computed(() => store.recommendedShows);
</script>
  
  