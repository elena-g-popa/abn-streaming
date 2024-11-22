<template src="./WatchList.template.html"></template>
  
  <script setup>
import { useTvShowStore } from "../../store/tvShowStore";
import { useRouter } from "vue-router";
import { computed } from "vue";

import ShowCard from "../show-card/ShowCard.vue";

const store = useTvShowStore();
const router = useRouter();

const watchListShows = computed(() => store.watchList);

const recommendedShows = computed(() => store.recommendedShows);
</script>
  
  