export const sortByRating = (a, b) => {
    const ratingA = a.rating.average || 0;
    const ratingB = b.rating.average || 0;
    return ratingB - ratingA;
  };

export const filterShows = (shows, query, genre) => {
  return shows.filter((show) => {
    const nameMatch = query === "" || show.name.toLowerCase().includes(query.toLowerCase());
    const genreMatch = genre === "" || show.genres.includes(genre);
    return nameMatch && genreMatch;
  });
};

export const getTopRatedShow = (filteredShows) => {
  return filteredShows.length > 0 ? filteredShows[0] : null;
};

export const createSortedGroups = (groups, recommendedShows) => {
  const sortedRecommended = recommendedShows.sort(sortByRating);
  const sortedGroups = { Recommended: sortedRecommended };
  const sortedGenres = Object.keys(groups)
    .filter((key) => key !== "Recommended")
    .sort();

  sortedGenres.forEach((genre) => {
    sortedGroups[genre] = groups[genre];
  });

  return sortedGroups;
};

export const deduplicateShows = (recommendedShows) => {
  const seenShows = new Set();
  return recommendedShows.filter((show) => {
    if (seenShows.has(show.id)) {
      return false;
    } else {
      seenShows.add(show.id);
      return true;
    }
  });
};
