import { mount } from "@vue/test-utils";
import WatchListButton from "./WatchListButton.vue"; 
import { createPinia, setActivePinia } from "pinia";
import { useTvShowStore } from "@/store/tvShowStore";

jest.mock("@/store/tvShowStore", () => ({
  useTvShowStore: jest.fn(),
}));

describe("WatchListButton.vue", () => {
  let store;
  const mockShow = { id: 1, name: "Test Show" };

  beforeEach(() => {
    setActivePinia(createPinia());
    store = {
      watchList: [],
      addToWatchList: jest.fn(),
      removeFromWatchList: jest.fn(),
    };

    useTvShowStore.mockReturnValue(store);
  });

  it("renders correctly when the show is not in the watch list", () => {
    const wrapper = mount(WatchListButton, {
      props: { show: mockShow },
    });

    expect(wrapper.text()).toContain("Add to");
  });

  it("renders correctly when the show is in the watch list", () => {
    store.watchList = [mockShow];

    const wrapper = mount(WatchListButton, {
      props: { show: mockShow },
    });

    expect(wrapper.text()).toContain("Remove from");
  });

  it("calls addToWatchList when the show is not in the watch list", async () => {
    store.watchList = [];

    const wrapper = mount(WatchListButton, {
      props: { show: mockShow },
    });

    const button = wrapper.find("button"); 
    await button.trigger("click");

    expect(store.addToWatchList).toHaveBeenCalledWith(mockShow);
  });

  it("calls removeFromWatchList when the show is already in the watch list", async () => {
    store.watchList = [mockShow];

    const wrapper = mount(WatchListButton, {
      props: { show: mockShow },
    });

    const button = wrapper.find("button"); 
    await button.trigger("click");

    expect(store.removeFromWatchList).toHaveBeenCalledWith(mockShow.id);
  });
});
