<template src="./ShowCard.template.html"></template>

<script setup>
import "./ShowCard.styles.scss";
import { computed } from "vue";
import { defineProps } from "vue";
import { useTvShowStore } from "../../store/tvShowStore";
import { useRouter } from "vue-router";

import WatchListButton from "../watch-list-button/WatchListButton.vue";

const props = defineProps({
  show: {
    type: Object,
    required: true,
  },
});

const store = useTvShowStore();
const router = useRouter();

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
