import { Skeleton } from "@/components/ui/skeleton";

const ProfileDetailsSkeleton = () => {
  return (
    <div className="flex items-center justify-between pt-4 md:px-0 px-2">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center md:w-40 md:h-40 h-20 w-20 transition-all">
          <Skeleton className="md:w-40 md:h-40 h-20 w-20 rounded-full" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="font-semibold text-lg md:text-3xl">
            <Skeleton className="w-32 md:w-48 h-6" />
          </h2>
          <div className="flex items-center gap-1">
            <Skeleton className="md:h-5 md:w-5 h-4 w-4" />
            <Skeleton className="text-muted-foreground text-xs md:text-sm w-20" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="md:h-5 md:w-40 h-4 w-40" />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsSkeleton;
