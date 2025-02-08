
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NewsItem {
  title: string;
  link: string;
}

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using a CORS proxy to fetch RSS feed
        const response = await fetch(
          'https://api.allorigins.win/raw?url=' + 
          encodeURIComponent('https://www.nfl.com/rss/rsslanding?categoryId=10')
        );
        const data = await response.text();
        
        // Parse the XML manually since we can't use rss-parser in the browser
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        const items = xml.querySelectorAll("item");
        
        const newsItems: NewsItem[] = Array.from(items).slice(0, 10).map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "#"
        }));
        
        setNews(newsItems);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-white overflow-hidden py-2 border-b border-gray-800">
      <div className="animate-[slide_30s_linear_infinite] whitespace-nowrap inline-block">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-8 hover:text-gray-300 transition-colors inline-block"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
