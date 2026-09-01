import { Wrapper } from "./Wrapper";
import { Toggle } from "./Toggle";
import { getRecommended } from "@/lib/recommended-service";

import { Recommended, RecommendedSkeleton } from "./Recommended";
import { ToggleSkeleton } from "./Toggle";
import { getFollowers, getFollowing } from "@/lib/follow-service";
import { Followers } from "./Followers";
import { Following, FollowingSkeleton } from "./Following";
export const Sidebar = async () => {
  const recommended = await getRecommended();

  const following = await getFollowing();
  return (
    <Wrapper>
      <Toggle/>
      <div className="space-y-4 pt-4 lg:pt-0">
        <Following data={following} />  
        <Recommended users={recommended} />
      </div>
    </Wrapper>
  );
};

export const SidebarSkeleton = () => {
  return (
    <aside className='fixed left-0 flex flex-col w-17.5 lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50'>
      <ToggleSkeleton />
      <FollowingSkeleton />
      <RecommendedSkeleton />
    </aside>
  );
};