import { defineStore } from 'pinia';
import axios from 'axios';

export const useTvShowStore = defineStore('tvShowStore', {
  state: () => ({
    genres: [],
    shows: [],
    selectedShow: null,
    recommendedShows: [],
    watchList: [],
    showEpisodes: [],
  }),
  actions: {
    async fetchShows() {
      try {
        const response = await axios.get('https://api.tvmaze.com/shows');
        this.shows = response.data;
        this.genres = this.getGenres;
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    },
    async fetchShowById(showId) {
      try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${showId}`);
        this.selectedShow = response.data;
      } catch (error) {
        console.error('Error fetching show details:', error);
      }
    },
    async searchShows(query) {
      try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
        this.shows = response.data.map((result) => result.show); 
      } catch (error) {
        console.error("Error searching shows:", error);
      }
    },
    async fetchShowEpisodes(showId) {
      try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${showId}/episodes`);
        this.showEpisodes = response.data; 
      } catch (error) {
        console.error('Error fetching show episodes:', error);
      }
    },
    selectShow(showId) {
      this.selectedShow = this.shows.find(show => show.id === showId);
    },
    setRecommendedShows(shows) {
      this.recommendedShows = shows;
    },

    addToWatchList(show) {
      if (!this.watchList.find((s) => s.id === show.id)) {
        this.watchList.push(show); 
      }
    },

    removeFromWatchList(showId) {
      this.watchList = this.watchList.filter((show) => show.id !== showId); 
    }
  },
  getters: {
    getGenres(state) {
      const genreSet = new Set();
      state.shows.forEach((show) => {
        show.genres.forEach((genre) => genreSet.add(genre));
      });
      return Array.from(genreSet);
    },
  },
});
