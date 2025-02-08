
import { useEffect, useState } from "react";
import { NewsItem as NewsItemType } from "@/types/news";
import { fetchNewsItems } from "@/services/newsService";
import NewsItem from "./NewsItem";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [speed, setSpeed] = useState([60]); // Default 60s animation duration

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

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value);
    toast.success(`Animation speed updated to ${120 - value[0]}s`);
  };

  return (
    <div className="relative">
      <div className="bg-gray-100 text-gray-900 overflow-hidden py-2 border-b border-gray-200">
        <div 
          className="whitespace-nowrap inline-block" 
          style={{ animation: `slide ${speed[0]}s linear infinite` }}
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
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full bg-white p-4 shadow-lg rounded-b-lg">
        <div className="max-w-xs mx-auto">
          <p className="text-sm text-gray-600 mb-2">Ticker Speed Control</p>
          <Slider
            value={speed}
            onValueChange={handleSpeedChange}
            min={20}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Faster</span>
            <span className="text-xs text-gray-500">Slower</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
