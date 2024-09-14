"use clients"

import { FullUserType } from "@/types";
import React from "react";
import CreatePost from "./CreatePost";
import Timeline from "./Timeline";
import RightBar from "./RightBar";

interface MainCompProps {
  user: FullUserType;
}

const MainComp: React.FC<MainCompProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-6 space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0 mb-10">
      <div className="col-span-4 flex flex-col gap-6">
        <CreatePost user={user} />
        <Timeline user={user} />
      </div>
      <div className="col-span-2">
        <RightBar user={user}/>
      </div>
    </div>
  );
};

export default MainComp;
