
import { NewsItem as NewsItemType } from "@/types/news";

interface NewsItemProps {
  item: NewsItemType;
  isOriginal: boolean;
}

const NewsItem = ({ item, isOriginal }: NewsItemProps) => {
  return (
    <a
      key={isOriginal ? item.title : `duplicate-${item.title}`}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-8 hover:text-gray-600 transition-colors inline-block"
    >
      {item.title} •
    </a>
  );
};

export default NewsItem;
