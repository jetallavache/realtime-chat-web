import { DashIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { GetChannelType } from "@/hooks/useChannel";
import { useEffect, useState } from "react";
import dataProvider from "@/config/dataProvider";
import { useSocketContext } from "@/contexts/Socket/Context";
import { TChannelObject } from "@/contexts/Socket/interfaces";
import config from "@/config/constants";
import { resource } from ".";

interface NavProps {
  isCollapsed: boolean;
}

export function Nav({ isCollapsed }: NavProps) {
  const [focusItem, setFocusItem] = useState<TChannelObject>();

  const { getList } = dataProvider(config.apiUrl);

  const navigate = useNavigate();

  const { channels: currnetChannels } = useSocketContext().SocketState;

  const [loading, setLoading] = useState(false);
  const [oldChannels, setOldChannels] = useState<TChannelObject[]>([]);

  async function fetch(resource: string) {
    setLoading(true);

    try {
      getList(resource, { id: "" })
        .then((result): TChannelObject[] => {
          return result.items.map((item) => ({
            id: item.id,
            creator: item?.creator?.name,
            countMembers: item?.countMembers ? item.countMembers : 0,
            title: item.title,
            description: item.description,
          }));
        })
        .then((allChannels) => {
          const currentUsersSet = new Set(
            currnetChannels.map((e) => JSON.stringify(e)),
          );
          return allChannels.filter(
            (e) => !currentUsersSet.has(JSON.stringify(e)),
          );
        })
        .then((oldChannels) => {
          setOldChannels(oldChannels);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetch(resource);
  }, [currnetChannels]);

  const selectItem = (item: TChannelObject) => {
    setFocusItem(item);
    navigate(`/chat/${item.id}`);
  };

  const navList = (list: TChannelObject[]) => {
    return (
      <>
        {list.map((item, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={`/chat/${item.id}`}
                  className={cn(
                    item === focusItem
                      ? buttonVariants({ variant: "default", size: "icon" })
                      : buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                    item === focusItem &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                  )}
                  onClick={() => selectItem(item)}
                >
                  <DashIcon className="h-4 w-4" />
                  <span className="sr-only">{item.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {item.title}
                {/* {item.countMembers && (
                  <span className="ml-auto text-muted-foreground">
                    {item.countMembers}
                  </span>
                )} */}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              to={`/chat/${item.id}`}
              className={cn(
                item === focusItem
                  ? buttonVariants({ variant: "default", size: "sm" })
                  : buttonVariants({ variant: "ghost", size: "sm" }),
                item === focusItem && "dark:bg-muted dark:text-white ",
                "justify-start",
              )}
              onClick={() => selectItem(item)}
            >
              <DashIcon className="mr-2 h-4 w-4" />
              {item.title}
              {item.countMembers && (
                <span
                  className={cn(
                    "ml-auto",
                    item === focusItem && "text-background dark:text-white",
                  )}
                >
                  {/* {item.countMembers} */}
                </span>
              )}
            </Link>
          ),
        )}
      </>
    );
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      {loading && (
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {navList(currnetChannels)}
          {navList(oldChannels)}
        </nav>
      )}
    </div>
  );
}
