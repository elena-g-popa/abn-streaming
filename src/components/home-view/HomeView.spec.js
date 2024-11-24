import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import HomeView from "./HomeView.vue";
import { useTvShowStore } from "../../store/tvShowStore";
import { filterShows, sortByRating, createSortedGroups, deduplicateShows } from "../../utils/utils";

// Mocking modules
jest.mock("vue-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    currentRoute: { value: { path: "/mock-path", name: "MockRoute" } },
  })),
  useRoute: jest.fn(() => ({
    path: "/mock-path",
    name: "MockRoute",
    query: {},
  })),
}));

jest.mock("../../store/tvShowStore", () => ({
  useTvShowStore: jest.fn(),
}));

jest.mock("../show-card/ShowCard.vue", () => ({
  default: {
    name: "ShowCard",
    template: "<div class='show-card'>Show Card</div>",
  },
}));

jest.mock("../navigation-menu/NavigationMenu.vue", () => ({
  default: {
    name: "NavigationMenu",
    template: "<nav>Navigation Menu</nav>",
  },
}));

jest.mock("../../utils/utils", () => ({
  filterShows: jest.fn(),
  sortByRating: jest.fn(),
  createSortedGroups: jest.fn(),
  deduplicateShows: jest.fn(),
}));

describe("HomeView.vue", () => {
  let wrapper;
  let store;
  let dropdownElement;

  const mockStore = {
    shows: [
      { id: 1, name: "Show 1", genres: ["Drama"], rating: 8 },
      { id: 2, name: "Show 2", genres: ["Comedy", "Drama"], rating: 7 },
    ],
    genres: ["Drama", "Comedy"],
    fetchShows: jest.fn(),
    searchShows: jest.fn(),
    setRecommendedShows: jest.fn(),
  };

  // Setup mock store
  beforeEach(() => {
    setActivePinia(createPinia());
    useTvShowStore.mockReturnValue(mockStore);

    filterShows.mockImplementation((shows, query, genre) => {
      return shows.filter(show => show.genres.includes(genre) && show.name.toLowerCase().includes(query));
    });
    deduplicateShows.mockImplementation(shows => [...new Set(shows.map(show => show.id))].map(id => shows.find(show => show.id === id)));
    createSortedGroups.mockImplementation((groups, recommendedShows) => ({ groups, recommendedShows }));

    wrapper = mount(HomeView, {
      global: { plugins: [createPinia()] },
    });

    dropdownElement = document.createElement("div");
    dropdownElement.classList.add("dropdown");
    document.body.appendChild(dropdownElement);
    wrapper.vm.dropdownRef = { value: dropdownElement };
  });

  afterEach(() => {
    jest.resetAllMocks();
    document.body.removeChild(dropdownElement);
  });

  describe("on mounted", () => {
    it("calls fetchShows on mount", () => {
      expect(mockStore.fetchShows).toHaveBeenCalled();
    });

    it("renders genres and shows correctly", () => {
      const genres = wrapper.findAll(".genre-group");
      expect(genres.length).toBe(2);

      const showCards = wrapper.findAllComponents({ name: "ShowCard" });
      expect(showCards.length).toBe(4);  
    });
  });



  describe("Computed showsByGenre", () => {
    it("computes showsByGenre correctly and calls relevant utilities", async () => {
      wrapper.vm.searchQuery = "Show";
      const showsByGenre = wrapper.vm.showsByGenre;

      expect(filterShows).toHaveBeenCalledWith(mockStore.shows, "show", "Drama");
      expect(filterShows).toHaveBeenCalledWith(mockStore.shows, "show", "Comedy");

      expect(sortByRating).toHaveBeenCalled();
      expect(deduplicateShows).toHaveBeenCalled();
      expect(createSortedGroups).toHaveBeenCalled();

      console.log(showsByGenre.recommendedShows)

      expect(showsByGenre).toEqual({"groups": {"Comedy": [{"genres": ["Comedy", "Drama"], "id": 2, "name": "Show 2", "rating": 7}], "Drama": [{"genres": ["Drama"], "id": 1, "name": "Show 1", "rating": 8}, {"genres": ["Comedy", "Drama"], "id": 2, "name": "Show 2", "rating": 7}]}, "recommendedShows": [{"genres": ["Comedy", "Drama"], "id": 2, "name": "Show 2", "rating": 7}, {"genres": ["Drama"], "id": 1, "name": "Show 1", "rating": 8}]});

    });
  });

  describe("Genre List Toggles", () => {
    it("toggles genre list visibility", async () => {
      expect(wrapper.vm.isGenreListVisible).toBe(false);

      wrapper.vm.toggleGenreList();
      expect(wrapper.vm.isGenreListVisible).toBe(true);

      wrapper.vm.toggleGenreList();
      expect(wrapper.vm.isGenreListVisible).toBe(false);
    });

    it("hides genre list", async () => {
      wrapper.vm.isGenreListVisible = true;
      wrapper.vm.hideGenreList();
      expect(wrapper.vm.isGenreListVisible).toBe(false);
    });
  });

  describe("Search functionality", () => {
    it("calls searchShows when the searchQuery is not empty", async () => {
      wrapper.vm.searchQuery = "Show 1";
      await wrapper.vm.handleSearch();

      expect(mockStore.searchShows).toHaveBeenCalledWith("Show 1");
      expect(mockStore.fetchShows).toHaveBeenCalled();
    });

    it("calls fetchShows when the searchQuery is empty", async () => {
      wrapper.vm.searchQuery = "";
      await wrapper.vm.handleSearch();

      expect(mockStore.fetchShows).toHaveBeenCalled();
      expect(mockStore.searchShows).not.toHaveBeenCalled();
    });
  });
});
