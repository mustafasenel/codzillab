"use clients"

import { FullOrganizationType, FullUserType } from "@/types";
import React from "react";
import CreatePost from "./CreatePost";
import Timeline from "./Timeline";
import RightBar from "./RightBar";

interface MainCompProps {
  user: FullUserType;
  organizations?: FullOrganizationType[];
}

const MainComp: React.FC<MainCompProps> = ({ user, organizations }) => {
  return (
    <div className="grid grid-cols-6 space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0 mb-10">
      <div className="md:col-span-4 col-span-6 flex flex-col gap-6">
        <CreatePost user={user} />
        <Timeline user={user} />
      </div>
      <div className="col-span-2 md:flex hidden">
        <RightBar user={user} organizations={organizations}/>
      </div>
    </div>
  );
};

export default MainComp;
