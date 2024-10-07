"use client";

import { FullOrganizationType } from "@/types";
import React, { useEffect, useState } from "react";
import { Search } from "../../friend-requests/components/search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { UserCheck, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from "@prisma/client";
import OrganizationCard from "./OrganizationCard";

interface OrganizationsProps {
  organizations?: FullOrganizationType[] | [];
  currentUser: User
}

const OrganizationExplore: React.FC<OrganizationsProps> = ({
  organizations,
  currentUser
}) => {
  const router = useRouter()
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Search />
        <Button onClick={() => router.push("/settings/organizations")}>Oluştur</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {organizations ? (
          organizations.map((organization, index) => (
            <OrganizationCard key={index} organization={organization} currentUser={currentUser} />
          ))
        ) : (
          <div className="w-full flex items-center justify-center">
            Organizasyon bulunamadı
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationExplore;
