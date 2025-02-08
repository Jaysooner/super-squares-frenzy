
import { NewsItem } from "@/types/news";

export const fetchNewsItems = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      'https://api.allorigins.win/raw?url=' + 
      encodeURIComponent('https://www.espn.com/espn/rss/nfl/news')
    );
    const data = await response.text();
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "text/xml");
    const items = xml.querySelectorAll("item");
    
    return Array.from(items).slice(0, 15).map((item) => ({
      title: item.querySelector("title")?.textContent?.replace("<![CDATA[", "").replace("]]>", "") || "",
      link: item.querySelector("link")?.textContent?.replace("<![CDATA[", "").replace("]]>", "") || "#"
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
