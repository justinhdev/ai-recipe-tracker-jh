const ShimmerBlock = ({ className }: { className?: string }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded ${className || ""}`}
  ></div>
);

export default function RecipeShimmer() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-full max-w-2xl mx-auto animate-pulse space-y-6">
      <ShimmerBlock className="h-7 w-3/5" />

      <div>
        <ShimmerBlock className="h-5 w-1/4 mb-3" />
        <div className="flex flex-wrap gap-2">
          <ShimmerBlock className="h-7 w-20 rounded-full" />
          <ShimmerBlock className="h-7 w-24 rounded-full" />
          <ShimmerBlock className="h-7 w-16 rounded-full" />
        </div>
      </div>

      <div>
        <ShimmerBlock className="h-5 w-1/3 mb-3" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <ShimmerBlock className="flex-none w-6 h-6 rounded-full" />
              <div className="flex-grow space-y-2">
                <ShimmerBlock className="h-4 w-full" />
                <ShimmerBlock className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <ShimmerBlock className="h-4 w-3/4 mx-auto mb-3" />
        <ShimmerBlock className="h-8 w-32 mx-auto rounded-full mb-4" />
        <ShimmerBlock className="h-10 w-28 rounded" />
      </div>
    </div>
  );
}
