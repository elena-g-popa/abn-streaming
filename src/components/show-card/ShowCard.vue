<template src="./ShowCard.template.html"></template>

<script setup>
import "./ShowCard.styles.scss";
import { computed } from "vue";
import { defineProps } from "vue";
import { useTvShowStore } from "../../store/tvShowStore";
import { useRouter } from "vue-router";

const props = defineProps({
  show: {
    type: Object,
    required: true,
  },
});

const store = useTvShowStore();
const router = useRouter();

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

const handleCardClick = () => {
  store
    .fetchShowById(props.show.id)
    .then(() => {
      router.push(`/show/${props.show.id}`);
    })
    .catch((error) => {
      console.error("Error selecting show:", error);
    });
};
</script>
