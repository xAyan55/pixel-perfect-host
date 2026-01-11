import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "bg-muted/50 rounded-lg animate-pulse",
        className
      )}
    />
  );
};

// Feature card skeleton
export const FeatureCardSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="w-10 h-10 rounded-lg mb-3" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// FAQ skeleton
export const FAQSkeleton = () => (
  <div className="glass-card px-6 py-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-4 rounded-sm" />
    </div>
  </div>
);

// Review card skeleton
export const ReviewCardSkeleton = () => (
  <div className="p-6 rounded-2xl bg-card/30 border border-white/[0.05]">
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-5 h-5 rounded-sm" />
      ))}
    </div>
    <Skeleton className="h-6 w-2/3 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-3/4 mb-5" />
    <div className="pt-4 border-t border-white/[0.05]">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Plan card skeleton
export const PlanCardSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="h-6 w-1/2 mb-4" />
    <Skeleton className="h-10 w-2/3 mb-6" />
    <div className="space-y-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
    <Skeleton className="h-12 w-full rounded-full" />
  </div>
);

// Feature section loading skeleton
export const FeaturesSectionSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
    {[...Array(9)].map((_, i) => (
      <FeatureCardSkeleton key={i} />
    ))}
  </div>
);

// FAQ section loading skeleton
export const FAQSectionSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <FAQSkeleton key={i} />
    ))}
  </div>
);
