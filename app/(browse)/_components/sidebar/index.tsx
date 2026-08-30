import { Wrapper } from "./Wrapper";
import { Toggle } from "./Toggle";
import { getRecommended } from "@/lib/recommended-service";

import { Recommended, RecommendedSkeleton } from "./Recommended";
export const Sidebar = async () => {
  const recommended = await getRecommended();
  return (
    <Wrapper>
      <Toggle/>
      <div className="space-y-4 pt-4 lg:pt-0">
        <Recommended users={recommended} />
      </div>
    </Wrapper>
  );
};

export const SidebarSkeleton = () => {
  return (
    <aside className='fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50'>
      <RecommendedSkeleton />
    </aside>
  );
};