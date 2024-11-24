<template src="./ShowDetails.template.html"></template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTvShowStore } from "../../store/tvShowStore";

import "./ShowDetails.styles.scss";
import NavigationMenu from "../navigation-menu/NavigationMenu.vue";
import WatchListButton from "../watch-list-button/WatchListButton.vue";

const route = useRoute();
const store = useTvShowStore();

const show = computed(() => store.selectedShow);

const groupedEpisodes = computed(() => {
  const seasons = {};
  store.showEpisodes.forEach((episode) => {
    if (!seasons[episode.season]) {
      seasons[episode.season] = [];
    }
    seasons[episode.season].push(episode);
  });
  return seasons;
});

onMounted(async () => {
  const showId = route.params.id;
  await store.fetchShowById(showId);
  await store.fetchShowEpisodes(showId);
});

const sanitizeHtml = (html) => {
  return html.replace(/<\/?p>/g, "");
};
</script>
