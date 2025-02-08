
import { NewsItem } from "@/types/news";

export const fetchNewsItems = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      'https://api.allorigins.win/raw?url=' + 
      encodeURIComponent('https://www.nfl.com/rss/rsslanding?categoryId=10')
    );
    const data = await response.text();
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "text/xml");
    const items = xml.querySelectorAll("item");
    
    return Array.from(items).slice(0, 10).map((item) => ({
      title: item.querySelector("title")?.textContent || "",
      link: item.querySelector("link")?.textContent || "#"
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

