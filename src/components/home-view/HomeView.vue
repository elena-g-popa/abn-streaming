<template src="./HomeView.template.html"></template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useTvShowStore } from "../../store/tvShowStore";
import { useRouter } from "vue-router";

import {
  sortByRating,
  filterShows,
  createSortedGroups,
  deduplicateShows,
} from "../../utils/utils";
import "./HomeView.styles.scss";

import ShowCard from "../show-card/ShowCard.vue";

const store = useTvShowStore();
const router = useRouter();
const searchQuery = ref("");

onMounted(() => {
  store.fetchShows();
});

const showsByGenre = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const groups = {};

  const recommendedShows = [];
  const seenShows = new Set();

  store.genres.forEach((genre) => {
    const filteredShows = filterShows(store.shows, query, genre).sort(
      sortByRating
    );

    if (filteredShows.length > 0) {
      groups[genre] = filteredShows;

      const topShow = filteredShows[0];

      if (!seenShows.has(topShow.id)) {
        recommendedShows.push(topShow);
        seenShows.add(topShow.id);
      }
    }
  });

  const deduplicatedRecommended = deduplicateShows(recommendedShows);
  store.setRecommendedShows(deduplicatedRecommended);

  return createSortedGroups(groups, deduplicatedRecommended);
});

const selectShow = (showId) => {
  store
    .fetchShowById(showId)
    .then(() => {
      router.push(`/show/${showId}`);
    })
    .catch((error) => {
      console.error("Error selecting show:", error);
    });
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    store.searchShows(searchQuery.value.trim());
  } else {
    store.fetchShows();
  }
};
</script>
