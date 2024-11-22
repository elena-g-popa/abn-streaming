import { defineStore } from 'pinia';
import axios from 'axios';

export const useTvShowStore = defineStore('tvShowStore', {
  state: () => ({
    genres: [],
    shows: [],
    selectedShow: null,
  }),
  actions: {
    async fetchShows() {
      try {
        const response = await axios.get('https://api.tvmaze.com/shows');
        this.shows = response.data;
        this.extractGenres();
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
    extractGenres() {
      const genreSet = new Set();
      this.shows.forEach(show => {
        show.genres.forEach(genre => genreSet.add(genre));
      });
      this.genres = Array.from(genreSet);
    },
    selectShow(showId) {
      this.selectedShow = this.shows.find(show => show.id === showId);
    },
  },
});
