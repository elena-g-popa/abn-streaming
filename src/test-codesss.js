import axios from "axios";
import { setActivePinia, createPinia } from "pinia";
import { useTvShowStore } from "./tvShowStore";
import { vi } from "vitest";

vi.mock("axios");

describe("tvShowStore - fetchShowById", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should fetch and set the selected show when given a valid ID", async () => {
    // Arrange: Mock API response
    const store = useTvShowStore();
    const mockShow = { id: 1, name: "Mock Show", genres: ["Drama"] };
    axios.get.mockResolvedValueOnce({ data: mockShow });

    // Act: Call fetchShowById
    await store.fetchShowById(1);

    // Assert: Check that the selected show is correctly set
    expect(axios.get).toHaveBeenCalledWith("https://api.tvmaze.com/shows/1");
    expect(store.selectedShow).toEqual(mockShow);
  });

  it("should handle errors gracefully when fetching fails", async () => {
    // Arrange: Mock API error
    const store = useTvShowStore();
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Act: Call fetchShowById
    await store.fetchShowById(1);

    // Assert: Ensure selectedShow remains null
    expect(store.selectedShow).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching show details:",
      expect.any(Error)
    );
  });
});
