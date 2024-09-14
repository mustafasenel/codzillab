"use client";

import React, { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const Header = () => {

  return (
    <div
      className={cn(
        "relative h-[513px] flex flex-col justify-center items-center space-y-6 w-full"
      )}
    >
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="circlePosition w-[300px] h-[300px] bg-[#ce1c43]/40 rounded-full absolute top-[30%] left-[35%] -translate-x-1/4 -translate-y-1/2 blur-[120px]"></div>
      <div className="circlePosition w-[300px] h-[300px] bg-[#ffe139]/40 rounded-full absolute  top-[60%] right-[35%] -translate-x-1/4 -translate-y-1/2 blur-[120px]"></div>
      <span className="bg-accent px-5 py-2 rounded-full text-sm border border-foreground/20 text-nowrap">
        Yeni oyun arkadaşlarıyla tanışmaya hazır olun 🎉
      </span>
      <h1 className="md:text-5xl text-3xl font-bold leading-snug text-center">
        Oyuncuların Yeni Dünyası
      </h1>
      <h2 className="text-md md:text-lg font-light text-muted-foreground">
        Oyun Dünyasında Sosyal Etkileşimlerinizi Geliştirin ve Yeniliklere Adım Atın
      </h2>
      <div className="flex items-center justify-between gap-6 z-20">
        <Button variant={"secondary"}>
          Hesap oluştur
        </Button>
        <Button variant={"default"}>
          Keşfet
        </Button>
      </div>
    </div>
  );
};

export default Header;
