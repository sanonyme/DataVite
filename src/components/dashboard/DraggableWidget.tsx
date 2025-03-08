import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Card } from "../ui/card";

interface DraggableWidgetProps {
  id: string;
  type: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  onResize?: (id: string, width: number, height: number) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  type,
  children,
  width = 400,
  height = 300,
  onResize,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({ width, height });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + moveEvent.clientX - startX;
      const newHeight = startHeight + moveEvent.clientY - startY;

      setDimensions({
        width: Math.max(200, newWidth),
        height: Math.max(150, newHeight),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setIsResizing(false);

      if (onResize) {
        onResize(id, dimensions.width, dimensions.height);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={drag}
      className={`relative ${isDragging ? "opacity-50" : "opacity-100"} transition-opacity duration-200 group`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
    >
      <Card className="w-full h-full overflow-hidden shadow-lg border border-border group-hover:border-primary/50 transition-all duration-200">
        <div className="absolute top-0 left-0 right-0 h-6 bg-muted/30 cursor-move flex items-center px-2 text-xs font-medium text-muted-foreground z-10">
          <div className="flex-1">• Drag to move</div>
          <div className="text-xs opacity-50 flex items-center">
            <svg width="12" height="12" viewBox="0 0 24 24" className="mr-1">
              <path
                fill="currentColor"
                d="M3,3H9V7H3V3M15,3H21V7H15V3M3,11H9V15H3V11M15,11H21V15H15V11M3,19H9V23H3V19M15,19H21V23H15V19Z"
              />
            </svg>
            Grid-snapping
          </div>
        </div>
        <div className="pt-6 h-full">{children}</div>
      </Card>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center bg-background/80 border border-border rounded-tl-md hover:bg-primary/10 hover:border-primary/50 transition-colors duration-200"
        onMouseDown={handleMouseDown}
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path
            d="M0 10L10 10L10 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default DraggableWidget;
