import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ShowDetails from "./ShowDetails.vue";
import { useTvShowStore } from "../../store/tvShowStore";
import { useRoute } from "vue-router";
import { reactive } from "vue";

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
}));

jest.mock("../../store/tvShowStore", () => ({
  useTvShowStore: jest.fn(),
}));

jest.mock("../navigation-menu/NavigationMenu.vue", () => ({
  default: {
    name: "NavigationMenu",
    template: "<nav>Navigation Menu</nav>",
  },
}));

jest.mock("../watch-list-button/WatchListButton.vue", () => ({
  default: {
    name: "WatchListButton",
    template: "<button>Watch List Button</button>",
  },
}));

describe("ShowDetails.vue", () => {
  let wrapper;
  let mockStore;
  let pinia;

  const createMockStore = () => reactive({
    shows: [
      { id: 1, name: "Show 1", genres: ["Drama"], rating: 8 },
      { id: 2, name: "Show 2", genres: ["Comedy", "Drama"], rating: 7 },
    ],
    genres: ["Drama", "Comedy"],
    fetchShows: jest.fn(),
    fetchShowById: jest.fn(),
    fetchShowEpisodes: jest.fn(),
    searchShows: jest.fn(),
    setRecommendedShows: jest.fn(),
    showEpisodes: [
      { season: 1, episode: 1, name: "Episode 1", summary: 'test' },
      { season: 1, episode: 2, name: "Episode 2", summary: 'test' },
      { season: 2, episode: 1, name: "Episode 1", summary: 'test' },
    ],
    selectedShow: null, 
  });

  const mountComponent = () => {
    wrapper = mount(ShowDetails, {
      global: { plugins: [pinia] },
    });
  };

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    mockStore = createMockStore();
    useTvShowStore.mockReturnValue(mockStore);
    useRoute.mockReturnValue({ params: { id: "1" } });

    mountComponent();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls fetchShowById and fetchShowEpisodes on mounted", () => {
    expect(mockStore.fetchShowById).toHaveBeenCalledWith("1");
    expect(mockStore.fetchShowEpisodes).toHaveBeenCalledWith("1");
  });
  

  it("groups episodes by season correctly", () => {
    const groupedEpisodes = wrapper.vm.groupedEpisodes;

    expect(groupedEpisodes).toEqual({
      1: [
        { season: 1, episode: 1, name: "Episode 1", summary: 'test' },
        { season: 1, episode: 2, name: "Episode 2", summary: 'test' },
      ],
      2: [{ season: 2, episode: 1, name: "Episode 1", summary: 'test' }],
    });
  });

  it("get the selected show correctly in the computed 'show' property", async () => {
    expect(wrapper.vm.show).toBeNull();

    const newShow = { id: 2, name: "Show 2", genres: ["Comedy", "Drama"], rating: 7, episode:{summary: 'test'} };
    mockStore.selectedShow = newShow;
    await wrapper.vm.$nextTick(); 

    expect(wrapper.vm.show).toEqual(newShow);
  });

  it("correctly sanitizes HTML", () => {
    const unsanitizedHtml = "<p>This is a paragraph.</p><p>Another paragraph.</p>";
    const sanitizedHtml = wrapper.vm.sanitizeHtml(unsanitizedHtml);

    expect(sanitizedHtml).toBe("This is a paragraph.Another paragraph.");
  });
});
