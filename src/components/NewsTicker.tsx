
import { useEffect, useState } from "react";
import { NewsItem as NewsItemType } from "@/types/news";
import { fetchNewsItems } from "@/services/newsService";
import NewsItem from "./NewsItem";
import { toast } from "sonner";

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);

  useEffect(() => {
    const updateNews = async () => {
      try {
        const newsItems = await fetchNewsItems();
        setNews(newsItems);
      } catch (error) {
        console.error("Error updating news:", error);
        toast.error("Failed to fetch news updates");
      }
    };

    updateNews();
    const interval = setInterval(updateNews, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Fixed animation duration of 192s (50% slower than the previous slowest speed of 96s)
  const animationDuration = 192;

  return (
    <div className="relative">
      <div className="bg-[#1A1F2C] text-gray-100 overflow-hidden py-2 border-b border-gray-800">
        <div 
          className="whitespace-nowrap inline-block" 
          style={{ animation: `slide ${animationDuration}s linear infinite` }}
        >
          {news.map((item) => (
            <NewsItem key={item.title} item={item} isOriginal={true} />
          ))}
          {/* Duplicate items to create seamless loop */}
          {news.map((item) => (
            <NewsItem key={`duplicate-${item.title}`} item={item} isOriginal={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;

