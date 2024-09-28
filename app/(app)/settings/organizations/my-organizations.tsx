"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Organization } from "@prisma/client";
import { CopyPlus } from "lucide-react";
import React, { useState } from "react";
import { CreateOrganization } from "./CreateOrganization";
import Image from "next/image";
import { FullOrganizationType } from "@/types";

interface MyOrganizationsProps {
  organizations?: FullOrganizationType[] | [];
}

const MyOrganizations: React.FC<MyOrganizationsProps> = ({ organizations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div>
      {organizations == null || organizations?.length == 0 ? (
        <div className="flex flex-col md:flex-row items-center w-full gap-6 p-0 md:h-32 ">
          <Card
            className="w-full md:w-1/4 h-full items-center justify-center p-4 dark:bg-slate-800 bg-slate-200 cursor-pointer hover:opacity-70 transition-all"
            onClick={handleOpenModal}
          >
            <CardContent className="flex items-center justify-center h-full p-0">
              <div className="flex items-center gap-2 md:gap-4">
                <CopyPlus size={20} />
                <p className="text-sm">Yeni Yarat</p>
              </div>
            </CardContent>
          </Card>
          <div className="flex-1 items-center gap-4 border p-2 rounded-xl justify-center w-full h-full">
            <p className="text-muted-foreground text-sm flex items-center justify-center h-full">
              Henüz organizasyon oluşturmadınız.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex-shrink-0 min-w-40">
            <Card
              className="h-full items-center justify-center p-4 dark:bg-slate-800 bg-slate-200 cursor-pointer hover:opacity-70 transition-all"
              onClick={handleOpenModal}
            >
              <CardContent className="flex items-center justify-center h-full p-0">
                <div className="flex items-center gap-2 md:gap-4">
                  <CopyPlus size={20} />
                  <p className="text-sm">Yeni Oluştur</p>
                </div>
              </CardContent>
            </Card>
          </div>
          {organizations.map((organization, index) => (
            <div key={index} className="cursor-pointer hover:opacity-75 transition-all" onClick={() => {}}>
              <Card>
                <CardContent className="flex flex-col p-0 pb-2 gap-2">
                  <div className="gap-4">
                    <Image
                      src={
                        organization.logo ? organization.logo : "/symbol.png"
                      }
                      alt="organization"
                      width={40}
                      height={40}
                      quality={100}
                      unoptimized
                      className="w-40 h-32 rounded-t-xl object-cover bg-center bg-origin-content"
                    />
                  </div>
                  <p className="text-sm px-2 font-semibold">
                    {organization.name}
                  </p>
                  <p className="text-sm px-2 text-muted-foreground">
                    Üyeler • {organization.members?.length}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
      <CreateOrganization isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MyOrganizations;
