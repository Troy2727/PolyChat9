import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Virtual scrolling component for large lists
 * Optimizes performance by only rendering visible items
 */
const VirtualScrollList = ({
  items = [],
  itemHeight = 50,
  containerHeight = 300,
  renderItem,
  overscan = 5,
  className = "",
  onScroll = null,
  scrollToIndex = null,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Calculate total height and visible items
  const totalHeight = items.length * itemHeight;
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }));
  }, [items, visibleRange, itemHeight]);

  // Handle scroll
  const handleScroll = (e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    
    if (onScroll) {
      onScroll(e, {
        scrollTop: newScrollTop,
        visibleRange,
        totalHeight,
      });
    }
  };

  // Scroll to specific index
  useEffect(() => {
    if (scrollToIndex !== null && containerRef.current) {
      const targetScrollTop = scrollToIndex * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [scrollToIndex, itemHeight]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, top }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Hook for virtual scrolling with dynamic item heights
 */
export const useVirtualScroll = ({
  items,
  estimatedItemHeight = 50,
  containerHeight = 300,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState(new Map());
  const containerRef = useRef(null);

  // Calculate item positions
  const itemPositions = useMemo(() => {
    const positions = [];
    let currentTop = 0;

    for (let i = 0; i < items.length; i++) {
      const height = itemHeights.get(i) || estimatedItemHeight;
      positions.push({
        index: i,
        top: currentTop,
        height,
        bottom: currentTop + height,
      });
      currentTop += height;
    }

    return positions;
  }, [items.length, itemHeights, estimatedItemHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const viewportTop = scrollTop;
    const viewportBottom = scrollTop + containerHeight;

    let startIndex = 0;
    let endIndex = itemPositions.length - 1;

    // Binary search for start index
    for (let i = 0; i < itemPositions.length; i++) {
      if (itemPositions[i].bottom > viewportTop) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
    }

    // Binary search for end index
    for (let i = startIndex; i < itemPositions.length; i++) {
      if (itemPositions[i].top > viewportBottom) {
        endIndex = Math.min(itemPositions.length - 1, i + overscan);
        break;
      }
    }

    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemPositions, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => {
      const actualIndex = startIndex + index;
      const position = itemPositions[actualIndex];
      return {
        item,
        index: actualIndex,
        top: position?.top || 0,
        height: position?.height || estimatedItemHeight,
      };
    });
  }, [items, visibleRange, itemPositions, estimatedItemHeight]);

  // Update item height
  const updateItemHeight = (index, height) => {
    setItemHeights(prev => new Map(prev).set(index, height));
  };

  // Handle scroll
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const totalHeight = itemPositions.length > 0 
    ? itemPositions[itemPositions.length - 1].bottom 
    : 0;

  return {
    containerRef,
    visibleItems,
    totalHeight,
    handleScroll,
    updateItemHeight,
    visibleRange,
  };
};

/**
 * Auto-sizing virtual list item wrapper
 */
export const VirtualListItem = ({ 
  children, 
  index, 
  onHeightChange,
  className = "" 
}) => {
  const itemRef = useRef(null);

  useEffect(() => {
    if (itemRef.current && onHeightChange) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          onHeightChange(index, entry.contentRect.height);
        }
      });

      resizeObserver.observe(itemRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [index, onHeightChange]);

  return (
    <div ref={itemRef} className={className}>
      {children}
    </div>
  );
};

export default VirtualScrollList;
