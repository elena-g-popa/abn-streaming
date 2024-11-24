import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import WatchList from "./WatchList.vue";
import { useTvShowStore } from "../../store/tvShowStore";


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
  RouterLink: {
    template: '<a><slot /></a>', 
  },
  RouterView: {
    template: '<div><slot /></div>', 
  },
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

describe("WatchList.vue", () => {
  let store;
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(createPinia());

    store = {
      watchList: [
        { id: 1, name: "Show 1", genres: ["Drama"] },
        { id: 2, name: "Show 2", genres: ["Comedy"] },
        { id: 3, name: "Show 3", genres: ["Comedy"] },

      ],
      // recommendedShows: [
      //   { id: 3, name: "Show 3", genres: ["Action"] },
      //   { id: 4, name: "Show 4", genres: ["Comedy", "Action"] },
      // ],
    };

    useTvShowStore.mockReturnValue(store);
  });

  afterEach(() => {
    jest.resetAllMocks(); 
  });

  it("renders correctly when the watch list has shows", () => {
    const wrapper = mount(WatchList, {
      global: {
        plugins: [pinia], 
      },
    });

    const showCards = wrapper.findAllComponents({ name: "ShowCard" });
    expect(showCards.length).toBe(store.watchList.length);
    expect(wrapper.findAll(".watch-list-shows").length).toBe(1);
  });
});


  