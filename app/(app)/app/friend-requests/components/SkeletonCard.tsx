import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="group relative hover:shadow-sm border overflow-hidden rounded-lg h-full min-h-52 flex flex-col p-0 transition-all duration-300">
      <div className="flex-1 space-y-2 flex sm:flex-row flex-col">
        <div className="relative w-full sm:w-1/4 min-h-32 overflow-hidden border-b">
          <Skeleton className="w-full h-full rounded-none" />
          <div className="hidden group-hover:flex absolute bottom-1 left-1 flex-wrap gap-1 transition-all duration-300">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
        <div className="flex flex-1 flex-col pt-2 px-3 space-y-4 w-full sm:w-3/4 justify-between">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex flex-col justify-between py-1">
                  <Skeleton className="w-32 h-4" />
                </div>
              </div>

            </div>
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-4" />
          </div>
          <div className="flex items-center justify-between pb-3">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SkeletonCard;
