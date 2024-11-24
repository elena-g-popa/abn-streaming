<template src="./WatchListButton.template.html"></template>

<script setup>
import "./WatchListButton.styles.scss";
import { computed } from "vue";
import { defineProps } from "vue";
import { useTvShowStore } from "../../store/tvShowStore";

const props = defineProps({
  show: {
    type: Object,
    required: true,
  },
});

const store = useTvShowStore();

const isInWatchList = computed(() => {
  return store.watchList.some((show) => show.id === props.show.id);
});

const toggleWatchList = () => {
  if (isInWatchList.value) {
    store.removeFromWatchList(props.show.id);
  } else {
    store.addToWatchList(props.show);
  }
};
</script>
