<template src="./HomeView.template.html"></template>

<script setup>
import { onMounted, computed } from "vue";
import { useTvShowStore } from "../../store/tvShowStore";
import { useRouter } from "vue-router";
import "./HomeView.styles.scss";

const store = useTvShowStore();
const router = useRouter();

onMounted(() => {
  store.fetchShows();
});

const showsByGenre = computed(() => {
  const groups = {};
  store.genres.forEach((genre) => {
    groups[genre] = store.shows.filter((show) => show.genres.includes(genre));
  });
  return groups;
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
</script>