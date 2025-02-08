
import { useEffect, useState } from "react";
import { NewsItem as NewsItemType } from "@/types/news";
import { fetchNewsItems } from "@/services/newsService";
import NewsItem from "./NewsItem";
import { toast } from "sonner";

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [speed, setSpeed] = useState(10); // Default middle speed (1-20 range)
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDialMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const dial = e.currentTarget;
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    let degrees = angle * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    
    // Convert degrees to speed value (1-20)
    let newSpeed = Math.round((degrees / 360) * 19) + 1;
    if (newSpeed < 1) newSpeed = 1;
    if (newSpeed > 20) newSpeed = 20;
    
    setSpeed(newSpeed);
    toast.success(`Animation speed set to ${newSpeed}`);
  };

  // Convert speed (1-20) to animation duration (100-20 seconds)
  const getAnimationDuration = () => {
    return 100 - (speed * 4); // 20 speed = 20s duration, 1 speed = 96s duration
  };

  return (
    <div className="relative">
      <div className="bg-[#1A1F2C] text-gray-100 overflow-hidden py-2 border-b border-gray-800">
        <div 
          className="whitespace-nowrap inline-block" 
          style={{ animation: `slide ${getAnimationDuration()}s linear infinite` }}
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
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full bg-[#1A1F2C] p-4 shadow-lg rounded-b-lg border border-gray-800">
        <div className="max-w-xs mx-auto">
          <p className="text-sm text-gray-300 mb-4">Ticker Speed Control</p>
          <div 
            className="w-32 h-32 rounded-full border-4 border-gray-700 relative mx-auto cursor-pointer"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleDialMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleDialMove}
          >
            <div 
              className="absolute w-2 h-8 bg-[#D6BCFA] rounded-full"
              style={{
                left: '50%',
                top: '0',
                transform: `translateX(-50%) rotate(${(speed - 1) * (360 / 19)}deg)`,
                transformOrigin: 'bottom center',
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#D6BCFA] text-xl font-bold">{speed}</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Slower (1)</span>
            <span>Faster (20)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
