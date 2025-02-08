
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

  return (
    <div className="bg-gray-100 text-gray-900 overflow-hidden py-2 border-b border-gray-200">
      <div className="animate-[slide_30s_linear_infinite] whitespace-nowrap inline-block">
        {news.map((item) => (
          <NewsItem key={item.title} item={item} isOriginal={true} />
        ))}
        {/* Duplicate items to create seamless loop */}
        {news.map((item) => (
          <NewsItem key={`duplicate-${item.title}`} item={item} isOriginal={false} />
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
