import { Button } from "@/components/ui/button";
import { memo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Title } from "@radix-ui/react-toast";

interface PinterestCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  height: string;
  type?: string;
  hasButton?: boolean;
  buttonText?: string;
  badge?: string;
  isExiting?: boolean;
  onClick?: () => void;
}

const PinterestCard = memo(function PinterestCard({
  id,
  title,
  subtitle,
  description,
  image,
  hasButton = false,
  buttonText = "APPLY NOW",
  badge,
  onClick,
}: PinterestCardProps) {
  const isDragging = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  const handleMouseDown = () => {
    isDragging.current = false;
  };

  const handleMouseMove = () => {
    isDragging.current = true;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  const CardContent = (
    <div
      ref={cardRef}
      className={`relative h-full w-full overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-500 group  
       ${isVisible ? "opacity-100 scale-100" : "opacity-10 scale-80"} `}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <img
        src={image || "/placeholder.svg?height=300&width=250"}
        alt={title}
        draggable={false}
        className="block w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000"
        loading="lazy"
        decoding="async"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Button in top-right */}
      {hasButton && (
        <div className="absolute top-4 right-4 z-10">
          <Button className="bg-[#0a72bd] hover:bg-[#085a96] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            {buttonText}
          </Button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {subtitle && <div className="text-sm opacity-90 mb-1">{subtitle}</div>}
        <div className="text-md mb-3">{title}</div>
        {description && (
          <div className="text-lg font-semibold mb-1">
            {description.length > 100
              ? description.slice(0, 20) + "..."
              : description}
          </div>
        )}
      </div>
    </div>
  );

  // If onClick is provided, we keep direct click handling
  return onClick ? (
    CardContent
  ) : (
    <Link href={`/tile/${id}`} legacyBehavior>
      <a
        style={{ display: "block", height: "100%" }}
        draggable={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {CardContent}
      </a>
    </Link>
  );
});

export default PinterestCard;
