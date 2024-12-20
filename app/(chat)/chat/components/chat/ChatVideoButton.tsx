"use client"

import qs from "query-string";
import ActionTooltip from "../ActionTooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ChatVideoButton = () => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const isVideo = searchParams?.get("video");

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : false,
            }
        }, {skipNull: true});

        router.push(url);
    }

    const Icon = isVideo ? VideoOff : Video;
    const tooltipLabel = isVideo ? "Aramayı sonlandır" : "Görüntülü arama başlat";

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-slate-500 dark:text-slate-400"/>
      </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton
