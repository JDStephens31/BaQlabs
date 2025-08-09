interface OrderBookLevel {
  price: number;
  size: number;
  depth: number;
}

export default function OrderBook() {
  const bids: OrderBookLevel[] = [
    { price: 20004.75, size: 150, depth: 3 },
    { price: 20004.50, size: 92, depth: 2 },
    { price: 20004.25, size: 78, depth: 1 },
    { price: 20004.00, size: 156, depth: 4 },
  ];

  const asks: OrderBookLevel[] = [
    { price: 20005.00, size: 66, depth: 2 },
    { price: 20005.25, size: 42, depth: 1 },
    { price: 20005.50, size: 89, depth: 2 },
    { price: 20005.75, size: 134, depth: 3 },
  ];

  const getDepthBarWidth = (depth: number) => {
    const maxDepth = 4;
    return (depth / maxDepth) * 100;
  };

  return (
    <div className="p-4 font-mono text-sm">
      {/* Asks (sorted high to low) */}
      <div className="space-y-1 mb-4">
        {[...asks].reverse().map((level, index) => (
          <div key={index} className="flex justify-between items-center relative">
            <div 
              className="absolute right-0 h-full bg-red-100 opacity-30"
              style={{ width: `${getDepthBarWidth(level.depth)}%` }}
            />
            <span className="text-red-600">{level.price.toFixed(2)}</span>
            <span className="z-10 relative">{level.size}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="border-t border-b border-border py-2 text-center text-muted-foreground">
        Spread: 0.25
      </div>

      {/* Bids */}
      <div className="space-y-1 mt-4">
        {bids.map((level, index) => (
          <div key={index} className="flex justify-between items-center relative">
            <div 
              className="absolute left-0 h-full bg-green-100 opacity-30"
              style={{ width: `${getDepthBarWidth(level.depth)}%` }}
            />
            <span className="text-green-600">{level.price.toFixed(2)}</span>
            <span className="z-10 relative">{level.size}</span>
          </div>
        ))}
      </div>

      {/* Inside market indicator */}
      <div className="mt-4 text-xs text-muted-foreground">
        → marks inside market
      </div>
    </div>
  );
}