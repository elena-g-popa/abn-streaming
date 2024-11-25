<template src="./HomeView.template.html"></template>

<script setup>
import { onMounted, computed, ref, onBeforeUnmount } from "vue";

import { useTvShowStore } from "../../store/tvShowStore";

import {
  sortByRating,
  filterShows,
  createSortedGroups,
  deduplicateShows,
} from "../../utils/utils";
import "./HomeView.styles.scss";

import ShowCard from "../show-card/ShowCard.vue";
import NavigationMenu from "../navigation-menu/NavigationMenu.vue";

import { useRouter } from "vue-router";

const router = useRouter();
const store = useTvShowStore();
const searchQuery = ref("");
const isGenreListVisible = ref(false);
const dropdownRef = ref(null);

onMounted(() => {
  store.fetchShows();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const genres = computed(() => store.genres.sort());

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

const scrollToGenre = (genre) => {
  const genreElement = document.querySelector(`[data-genre="${genre}"]`);
  if (genreElement) {
    const topOffset = 290;
    const elementPosition =
      genreElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - topOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
    isGenreListVisible.value = false;
  }
};

const toggleGenreList = () => {
  isGenreListVisible.value = !isGenreListVisible.value;
};

const hideGenreList = () => {
  isGenreListVisible.value = false;
};

const handleGenreClick = (genre) => {
  scrollToGenre(genre);
  hideGenreList();
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    hideGenreList();
  }
};
</script>
