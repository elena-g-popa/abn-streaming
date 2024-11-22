<template src="./ShowDetails.template.html"></template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTvShowStore } from "../../store/tvShowStore";

import "./ShowDetails.styles.scss";

const route = useRoute();
const store = useTvShowStore();

const show = computed(() => store.selectedShow);

onMounted(() => {
  const showId = route.params.id;
  store.fetchShowById(showId);
});
</script>
