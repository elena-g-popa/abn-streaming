import { sortByRating, filterShows, getTopRatedShow, createSortedGroups, deduplicateShows } from './utils';

describe('sortByRating', () => {
  it('should sort shows by rating in descending order', () => {
    const shows = [
      { rating: { average: 7.5 }, name: 'Show A' },
      { rating: { average: 9.1 }, name: 'Show B' },
      { rating: { average: 8.2 }, name: 'Show C' },
    ];

    const sortedShows = shows.sort(sortByRating);

    expect(sortedShows[0].name).toBe('Show B');
    expect(sortedShows[1].name).toBe('Show C');
    expect(sortedShows[2].name).toBe('Show A');
  });

  it('should handle shows without a rating by treating them as 0', () => {
    const shows = [
      { rating: { average: 7.5 }, name: 'Show A' },
      { rating: {}, name: 'Show B' }, 
      { rating: { average: 9.1 }, name: 'Show C' },
    ];

    const sortedShows = shows.sort(sortByRating);

    expect(sortedShows[0].name).toBe('Show C');
    expect(sortedShows[1].name).toBe('Show A');
    expect(sortedShows[2].name).toBe('Show B');
  });

  it('should handle empty shows array gracefully', () => {
    const shows = [];
    const sortedShows = shows.sort(sortByRating);

    expect(sortedShows).toEqual([]);
  });

  it('should treat missing ratings as 0 when comparing', () => {
    const shows = [
      { rating: {}, name: 'Show A' },
      { rating: { average: 5 }, name: 'Show B' },
      { rating: { average: 3 }, name: 'Show C' },
    ];

    const sortedShows = shows.sort(sortByRating);

    expect(sortedShows[0].name).toBe('Show B');
    expect(sortedShows[1].name).toBe('Show C');
    expect(sortedShows[2].name).toBe('Show A');
  });
});

describe('filterShows', () => {
    const shows = [
      { name: 'Breaking Bad', genres: ['Drama', 'Crime'] },
      { name: 'Stranger Things', genres: ['Drama', 'Sci-Fi'] },
      { name: 'The Office', genres: ['Comedy'] },
      { name: 'The Crown', genres: ['Drama', 'History'] },
    ];
  
    it('should return shows that match both query and genre', () => {
        const query = 'Stranger Things';
        const genre = 'Drama';
        
        const result = filterShows(shows, query, genre);
        
        expect(result).toHaveLength(1); 
        expect(result[0].name).toBe('Stranger Things');
      });
  
    it('should return shows that match the genre but not the query', () => {
      const query = '';
      const genre = 'Comedy';
      
      const result = filterShows(shows, query, genre);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('The Office');
    });
  
    it('should return an empty array if no shows match the genre and query', () => {
      const query = 'Game of Thrones';
      const genre = 'Fantasy';
      
      const result = filterShows(shows, query, genre);
      
      expect(result).toHaveLength(0);
    });
  
    it('should return all shows if query is empty', () => {
      const query = '';
      const genre = 'Drama';
      
      const result = filterShows(shows, query, genre);
      
      expect(result).toHaveLength(3);
      expect(result.map(show => show.name)).toEqual([
        'Breaking Bad',
        'Stranger Things',
        'The Crown',
      ]);
    });
  
  });

  describe('getTopRatedShow', () => {
    it('should return the top-rated show if filteredShows is not empty', () => {
      const filteredShows = [{ id: 1, name: 'Show A' }, { id: 2, name: 'Show B' }];
      const result = getTopRatedShow(filteredShows);
      expect(result).toEqual(filteredShows[0]);
    });
  
    it('should return null if filteredShows is empty', () => {
      const filteredShows = [];
      const result = getTopRatedShow(filteredShows);
      expect(result).toBeNull();
    });
  });

  describe('createSortedGroups', () => {
    it('should return sorted recommended shows and preserve group order for other genres', () => {
      const groups = {
        Drama: [{ id: 1, name: 'Show A' }],
        Comedy: [{ id: 2, name: 'Show B' }],
      };
      const recommendedShows = [
        { id: 3, name: 'Show C', rating: { average: 8.5 } },
        { id: 4, name: 'Show D', rating: { average: 9.0 } },
      ];
  
      const result = createSortedGroups(groups, recommendedShows);
  
      expect(result).toEqual({
        Recommended: [
          { id: 4, name: 'Show D', rating: { average: 9.0 } },
          { id: 3, name: 'Show C', rating: { average: 8.5 } },
        ],
        Comedy: [{ id: 2, name: 'Show B' }],
        Drama: [{ id: 1, name: 'Show A' }],
      });
    });
  
    it('should exclude "Recommended" from sorting genres', () => {
      const groups = {
        Recommended: [{ id: 3, name: 'Show C' }],
        Action: [{ id: 4, name: 'Show D' }],
      };
      const recommendedShows = [];
  
      const result = createSortedGroups(groups, recommendedShows);
  
      expect(result).toEqual({
        Recommended: [],
        Action: [{ id: 4, name: 'Show D' }],
      });
    });
  });
  
  describe('deduplicateShows', () => {
    it('should remove duplicate shows based on id', () => {
      const recommendedShows = [
        { id: 1, name: 'Show A' },
        { id: 2, name: 'Show B' },
        { id: 1, name: 'Show A' },
      ];
  
      const result = deduplicateShows(recommendedShows);
  
      expect(result).toEqual([
        { id: 1, name: 'Show A' },
        { id: 2, name: 'Show B' },
      ]);
    });
  
    it('should return the same array if there are no duplicates', () => {
      const recommendedShows = [
        { id: 1, name: 'Show A' },
        { id: 2, name: 'Show B' },
      ];
  
      const result = deduplicateShows(recommendedShows);
  
      expect(result).toEqual(recommendedShows);
    });
  
    it('should return an empty array if the input is empty', () => {
      const recommendedShows = [];
  
      const result = deduplicateShows(recommendedShows);
  
      expect(result).toEqual([]);
    });
  });

  describe('sortByRating', () => {
    it('should sort shows by rating in descending order', () => {
      const shows = [
        { id: 1, name: 'Show A', rating: { average: 7.5 } },
        { id: 2, name: 'Show B', rating: { average: 8.0 } },
        { id: 3, name: 'Show C', rating: { average: 6.0 } },
      ];
  
      const sorted = shows.sort(sortByRating);
  
      expect(sorted).toEqual([
        { id: 2, name: 'Show B', rating: { average: 8.0 } },
        { id: 1, name: 'Show A', rating: { average: 7.5 } },
        { id: 3, name: 'Show C', rating: { average: 6.0 } },
      ]);
    });
  
    it('should handle shows with missing ratings', () => {
      const shows = [
        { id: 1, name: 'Show A', rating: { average: 7.5 } },
        { id: 2, name: 'Show B', rating: {} },
        { id: 3, name: 'Show C', rating: { average: 8.0 } },
      ];
  
      const sorted = shows.sort(sortByRating);
  
      expect(sorted).toEqual([
        { id: 3, name: 'Show C', rating: { average: 8.0 } },
        { id: 1, name: 'Show A', rating: { average: 7.5 } },
        { id: 2, name: 'Show B', rating: {} },
      ]);
    });
  });
  