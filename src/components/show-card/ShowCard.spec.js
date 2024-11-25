import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { useTvShowStore } from "../../store/tvShowStore";
import ShowCard from "./ShowCard.vue";
import { useRouter } from "vue-router";

jest.mock("vue-router", () => ({
    useRouter: jest.fn(() => ({
      push: jest.fn(),
    })),
  }));

jest.mock("../../store/tvShowStore", () => ({
  useTvShowStore: jest.fn(),
}));

describe("ShowCard.vue", () => {
  let pinia;
  let wrapper;
  let mockStore;
  let mockRouter;
  const mockShow = {
    id: 2,
    name: "Show 2",
    genres: ["Drama", "Comedy"],
    rating: 7,
  };
  const createMockStore = () => ({
    fetchShowById: jest.fn().mockResolvedValue(), 
    watchList: [
      { id: 1, name: "Show 1", genres: ["Drama"], rating: 8 },
      { id: 2, name: "Show 2", genres: ["Comedy", "Drama"], rating: 7 },
    ],
  });

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    mockStore = createMockStore();
    mockRouter = {
      push: jest.fn(),
    };

    useTvShowStore.mockReturnValue(mockStore);
    useRouter.mockReturnValue(mockRouter);

    wrapper = mount(ShowCard, {
      props: { show: mockShow },
    });

    jest.spyOn(console, "error").mockImplementation(() => {}); 
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders correctly with the provided show details", () => {
    expect(wrapper.text()).toContain("Show 2");
  });

  it("handles card click by calling fetchShowById and navigating to the show page", async () => {
    const card = wrapper.find(".show-card");
    expect(card.exists()).toBe(true);
  
    await card.trigger("click");
  
    expect(mockStore.fetchShowById).toHaveBeenCalledWith(mockShow.id);
    expect(mockRouter.push).toHaveBeenCalledWith(`/show/${mockShow.id}`);
  });


  it("logs an error and does not navigate when fetchShowById fails", async () => {
    const mockError = new Error("Failed to fetch show");
    mockStore.fetchShowById.mockRejectedValue(mockError); 

    const card = wrapper.find(".show-card");
    expect(card.exists()).toBe(true);

    await card.trigger("click");

    expect(mockStore.fetchShowById).toHaveBeenCalledWith(mockShow.id);
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Error selecting show:", mockError);
  });
  
});
