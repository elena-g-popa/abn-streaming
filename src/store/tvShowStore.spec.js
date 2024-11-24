import { setActivePinia, createPinia } from "pinia";
import { useTvShowStore } from "./tvShowStore";
import axios from "axios";

jest.mock("axios");

describe("fetchShows", () => {
  beforeEach(() => {
    setActivePinia(createPinia()); 
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  it("fetchShows should populate shows and genres", async () => {
    const mockShows = [
      { id: 1, name: "Show 1", genres: ["Drama"] },
      { id: 2, name: "Show 2", genres: ["Comedy", "Drama"] },
    ];
    axios.get.mockResolvedValue({ data: mockShows });

    const store = useTvShowStore();

    await store.fetchShows();

    expect(store.shows).toEqual(mockShows);
    expect(store.genres).toEqual(["Drama", "Comedy"]); 
    expect(axios.get).toHaveBeenCalledWith("https://api.tvmaze.com/shows");
  });

  it("should handle errors when fetching fails", async () => {
    const store = useTvShowStore();
    const mockError = new Error("Network Error");
    axios.get.mockRejectedValueOnce(mockError);

    await store.fetchShows();

    expect(store.shows).toEqual([]);
    expect(store.genres).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Error fetching shows:", mockError);
  });
});

describe("fetchShowById", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks(); 
    });

    it("should fetch and set the selected show when given a valid ID", async () => {
      const store = useTvShowStore();
      const mockShow = { id: 1, name: "Show 1", genres: ["Drama"] };
      axios.get.mockResolvedValueOnce({ data: mockShow });
  
      await store.fetchShowById(1);
  
      expect(axios.get).toHaveBeenCalledWith("https://api.tvmaze.com/shows/1");
      expect(store.selectedShow).toEqual(mockShow);
    });
  
    it("should handle errors when fetching fails", async () => {
        const store = useTvShowStore();
        const mockError = new Error("Network Error");
        axios.get.mockRejectedValueOnce(mockError);
    
        await store.fetchShowById(1);
    
        expect(store.selectedShow).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching show details:",
          mockError
        );
      });
});

describe("searchShows", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        jest.spyOn(console, "error").mockImplementation(() => {}); 
    });

    afterEach(() => {
        jest.restoreAllMocks(); 
    });

    it("should populate shows with search results when query is provided", async () => {
        const store = useTvShowStore();
        const mockQuery = "friends";
        const mockSearchResults = [
        { show: { id: 1, name: "Friends", genres: ["Comedy"] } },
        { show: { id: 2, name: "Friends: The Reunion", genres: ["Documentary"] } },
        ];
        axios.get.mockResolvedValueOnce({ data: mockSearchResults });

        await store.searchShows(mockQuery);

        expect(axios.get).toHaveBeenCalledWith(`https://api.tvmaze.com/search/shows?q=${mockQuery}`);
        expect(store.shows).toEqual(mockSearchResults.map((result) => result.show));
    });

    it("should handle errors when the search request fails", async () => {
        const store = useTvShowStore();
        const mockQuery = "nonexistent";
        const mockError = new Error("Network Error");
        axios.get.mockRejectedValueOnce(mockError);

        await store.searchShows(mockQuery);

        expect(store.shows).toEqual([]);
        expect(console.error).toHaveBeenCalledWith("Error searching shows:", mockError);
    });
});

describe("selectShow", () => {
    beforeEach(() => {
      setActivePinia(createPinia());
    });
  
    it("should set the selectedShow to the show with the matching ID", () => {
      const store = useTvShowStore();
      store.shows = [
        { id: 1, name: "Show 1" },
        { id: 2, name: "Show 2" },
      ];
  
      store.selectShow(2);
  
      expect(store.selectedShow).toEqual({ id: 2, name: "Show 2" });
    });
  });

  describe("setRecommendedShows", () => {
    beforeEach(() => {
      setActivePinia(createPinia());
    });
  
    it("should set recommendedShows to the provided array", () => {
      const store = useTvShowStore();
      const mockRecommendedShows = [
        { id: 1, name: "Show 1" },
        { id: 2, name: "Show 2" },
      ];
  
      store.setRecommendedShows(mockRecommendedShows);
  
      expect(store.recommendedShows).toEqual(mockRecommendedShows);
    });
  });
  
  
  

describe("addToWatchList", () => {
    beforeEach(() => {
      setActivePinia(createPinia());
    });
  
    it("should add a show to the watchList if it is not already present", () => {
      const store = useTvShowStore();
      const show1 = { id: 1, name: "Show 1" };
      const show2 = { id: 2, name: "Show 2" };
  
      store.addToWatchList(show1);
  
      expect(store.watchList).toHaveLength(1);
      expect(store.watchList[0]).toEqual(show1);
  
      store.addToWatchList(show2);
  
      expect(store.watchList).toHaveLength(2);
      expect(store.watchList).toContainEqual(show2);
  
      store.addToWatchList(show1);
  
      expect(store.watchList).toHaveLength(2); 
    });
  });

  describe("removeFromWatchList", () => {
    beforeEach(() => {
      setActivePinia(createPinia());
    });
  
    it("should remove the show with the matching ID from the watchList", () => {
      const store = useTvShowStore();
      store.watchList = [
        { id: 1, name: "Show 1" },
        { id: 2, name: "Show 2" },
        { id: 3, name: "Show 3" },
      ];
  
      store.removeFromWatchList(2);
  
      expect(store.watchList).toEqual([
        { id: 1, name: "Show 1" },
        { id: 3, name: "Show 3" },
      ]);
    });
  });
  
  
