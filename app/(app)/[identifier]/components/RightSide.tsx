"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FullOrganizationType, FullUserType } from "@/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  BookOpenText,
  BookUser,
  BriefcaseBusiness,
  Cake,
  GraduationCap,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaLink, FaReddit, FaXTwitter } from "react-icons/fa6";
import { IoIosLink } from "react-icons/io";
import { IoFemaleSharp, IoMaleSharp } from "react-icons/io5";

interface RightSideProps {
  user?: FullUserType | FullOrganizationType;
  currentUser?: FullUserType;
}

function getIconForUrl(url: string) {
  if (url) {
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return <FaXTwitter className="h-5 w-5 flex-shrink-0" size={20} />;
    } else if (url.includes("github.com")) {
      return <FaGithub className="h-5 w-5 flex-shrink-0" size={20} />;
    } else if (url.includes("facebook.com")) {
      return <FaFacebook className="h-5 w-5 flex-shrink-0" size={20} />;
    } else if (url.includes("linkedin.com")) {
      return <FaLinkedin className="h-5 w-5 flex-shrink-0" size={20} />;
    } else if (url.includes("instagram.com")) {
      return <FaInstagram className="h-5 w-5 flex-shrink-0" size={20} />;
    } else if (url.includes("reddit.com")) {
      return <FaReddit className="h-5 w-5 flex-shrink-0" size={20} />;
    } else {
      return <IoIosLink className="h-5 w-5 flex-shrink-0" size={20} />;
    }
  } else {
    return <IoIosLink className="h-5 w-5 flex-shrink-0" size={20} />;
  }
}

const RightSide: React.FC<RightSideProps> = ({ user, currentUser }) => {
  const [dobFormatted, setDobFormatted] = useState<string | null>(null);

  const [isOrganization, setIsOrganization] = useState(false);

  useEffect(() => {
    if (user) {
      setIsOrganization("ownerId" in user);
    }
  }, [user]);

  useEffect(() => {
    if (!isOrganization) {
      if ((user as FullUserType)?.dob) {
        const formatted = format(
          new Date((user as FullUserType)?.dob!),
          "d MMMM yyyy",
          {
            locale: tr,
          }
        );
        setDobFormatted(formatted);
      } else {
        setDobFormatted(null);
      }
    }
  }, [user]);
  const links = user ? ("links" in user ? user.links : user.socialLinks) : [];
  const description =
    user && "bio" in user
      ? (user as FullUserType).bio
      : (user as FullOrganizationType)?.description;

  return (
    <div className="flex flex-col gap-4">
      {description && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 w-full">
              <BookOpenText className="h-5 w-5 flex-shrink-0" size={20} />
              Hakkında
            </div>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <div className="flex items-start gap-2 w-full">
              <p className="text-sm">{description}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {!isOrganization && (
        <>
          {!!(user as FullUserType)?.dob &&
            !!(user as FullUserType)?.country &&
            !!(user as FullUserType).gender && (
              <Card>
                <CardContent className="flex flex-col space-y-3 pt-6">
                  <div className="flex items-center gap-2 w-full">
                    <Cake className="h-5 w-5 flex-shrink-0" size={20} />
                    <p className="text-sm">{dobFormatted}</p>
                  </div>
                  {(user as FullUserType)?.gender && (
                    <div className="flex items-center gap-2 w-full">
                      {(user as FullUserType)?.gender == "Erkek" ? (
                        <IoMaleSharp
                          className="h-5 w-5 flex-shrink-0"
                          size={20}
                        />
                      ) : (
                        <IoFemaleSharp
                          className="h-5 w-5 flex-shrink-0"
                          size={20}
                        />
                      )}
                      <p className="truncate text-sm ">
                        {(user as FullUserType)?.gender}
                      </p>
                    </div>
                  )}
                  {(user as FullUserType)?.country && (
                    <div className="flex items-center gap-2 w-full">
                      <MapPin
                        className="h-5 w-5 flex-shrink-0 truncate"
                        size={20}
                      />
                      <p className="text-sm">
                        {(user as FullUserType)?.country}
                      </p>
                    </div>
                  )}
                  {(user as FullUserType)?.education && (
                    <div className="flex items-center gap-2 w-full">
                      <GraduationCap
                        className="h-5 w-5 flex-shrink-0 truncate"
                        size={20}
                      />
                      <p className="text-sm">
                        {(user as FullUserType).education} 'da{" "}
                        <>
                          {(user as FullUserType).educationOnStudy
                            ? "okuyor"
                            : "okudu"}
                        </>
                      </p>
                    </div>
                  )}
                  {(user as FullUserType)?.work && (
                    <div className="flex items-center gap-2 w-full">
                      <BriefcaseBusiness
                        className="h-5 w-5 flex-shrink-0"
                        size={20}
                      />
                      <p className="text-sm truncate">
                        {(user as FullUserType).work} 'da çalışıyor
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </>
      )}
      {!!links.length && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 w-full">
              <FaLink className="h-5 w-5 flex-shrink-0" size={20} />
              Bağlantılar
            </div>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link}
                className={cn(
                  "flex items-center gap-2 w-full rounded-sm text-primary underline-offset-4 hover:underline"
                )}
              >
                {getIconForUrl(link)}
                <p className="text-sm truncate">{link}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RightSide;
