import { tool } from "ai";
import { z } from "zod";

/**
 * Web Search Tool
 *
 * This is a demonstration implementation that provides structured search capabilities.
 * In production, integrate with:
 * - SerpAPI (https://serpapi.com) - requires SERPAPI_API_KEY
 * - Tavily API (https://tavily.com) - requires TAVILY_API_KEY
 * - Google Custom Search - requires GOOGLE_API_KEY + SEARCH_ENGINE_ID
 *
 * For now, returns well-structured results based on common knowledge.
 * The AI model can use this structure to reason about results.
 */

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

/**
 * Mock search results for common queries
 * In production, this would call an actual search API
 */
function getMockSearchResults(query: string): SearchResult[] {
  const normalized = query.toLowerCase();

  // Example results - in production, fetch from real search API
  const mockDatabase: Record<string, SearchResult[]> = {
    weather: [
      {
        title: "Current Weather and Forecasts - Weather.gov",
        url: "https://www.weather.gov",
        snippet:
          "Get current weather conditions, forecasts, and severe weather alerts for your area.",
        source: "weather.gov",
      },
      {
        title: "Weather.com - The Weather Channel",
        url: "https://weather.com",
        snippet:
          "Current weather conditions, hourly forecasts, and extended forecasts worldwide.",
        source: "weather.com",
      },
    ],
    news: [
      {
        title: "BBC News - Home",
        url: "https://www.bbc.com/news",
        snippet:
          "Breaking news, sport, TV, radio and a whole lot more. The BBC informs, educates and entertains.",
        source: "bbc.com",
      },
      {
        title: "CNN - Breaking News",
        url: "https://www.cnn.com",
        snippet:
          "Find the latest news, photos, videos, live coverage and more from CNN.",
        source: "cnn.com",
      },
    ],
    python: [
      {
        title: "Welcome to Python.org",
        url: "https://www.python.org",
        snippet:
          "The official home of the Python Programming Language. Python is a programming language that lets you work more quickly.",
        source: "python.org",
      },
      {
        title: "Python Tutorial - W3Schools",
        url: "https://www.w3schools.com/python",
        snippet:
          "Well organized and easy to understand Web building tutorials with lots of examples.",
        source: "w3schools.com",
      },
    ],
  };

  // Find matching category
  for (const [key, results] of Object.entries(mockDatabase)) {
    if (normalized.includes(key)) {
      return results;
    }
  }

  // Default results for any query
  return [
    {
      title: `Search Results for "${query}"`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      snippet:
        "No specific results available. This tool requires integration with a real search API like SerpAPI or Google Search.",
      source: "search-api",
    },
  ];
}

export const webSearch = tool({
  description:
    "Search the web for information. Returns top search results including title, URL, and snippet. Note: This is a demonstration tool. For production use, integrate with SerpAPI, Tavily, or Google Search API.",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .max(200)
      .describe("Search query (e.g., 'Python programming', 'weather today')"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(5)
      .describe("Maximum number of results to return (default: 5)"),
  }),
  execute: async ({ query, limit }) => {
    try {
      // In production, call real search API here:
      // const response = await fetch('https://api.serpapi.com/search', {
      //   params: {
      //     q: query,
      //     api_key: process.env.SERPAPI_API_KEY,
      //   }
      // });
      // const data = await response.json();
      // return data.organic_results.slice(0, limit);

      const results = getMockSearchResults(query).slice(0, limit);

      return {
        query,
        resultCount: results.length,
        results,
        success: true,
        note: "This tool uses mock data. For production, integrate with a real search API.",
      };
    } catch (error) {
      return {
        query,
        error:
          error instanceof Error ? error.message : "Search failed unexpectedly",
        success: false,
      };
    }
  },
});
