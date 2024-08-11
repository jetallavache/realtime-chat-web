import { TokensIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { TChannelObject } from "@/config/interfaces";

interface NavProps {
    isCollapsed: boolean;
    items: TChannelObject[];
}

export function Nav({ isCollapsed, items }: NavProps) {
    let { id } = useParams();
    const navigate = useNavigate();
    const [focusItemId, setFocusItemId] = useState<string | undefined>(id);
    
    useEffect(() => {
        setFocusItemId(id);
    }, []);

    const selectItem = (item: TChannelObject) => {
        console.log("To do...");
        // navigate(`/chat/${item.id}`);
        // setFocusItemId(item.id);
        // window.location.reload();
    };

    const navList = (list: TChannelObject[]) => {
        return (
            <>
                {list.map((item, index) =>
                    isCollapsed ? (
                        <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link
                                    // to={`/chat/${item.id}`}
                                    to="#"
                                    className={cn(
                                        item.id === focusItemId
                                            ? buttonVariants({ variant: "default", size: "icon" })
                                            : buttonVariants({ variant: "ghost", size: "icon" }),
                                        "h-9 w-9",
                                        item.id === focusItemId &&
                                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                                    )}
                                    onClick={() => selectItem(item)}
                                >
                                    <TokensIcon className="h-4 w-4" />
                                    <span className="sr-only">{item.title}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex items-center gap-4">
                                {item.title}
                                {item.members && (
                                    <span className="ml-auto text-muted-foreground">{item.members.length}</span>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Link
                            key={index}
                            // to={`/chat/${item.id}`}
                            to="#"
                            className={cn(
                                item.id === focusItemId
                                    ? buttonVariants({ variant: "default", size: "sm" })
                                    : buttonVariants({ variant: "ghost", size: "sm" }),
                                item.id === focusItemId && "dark:bg-muted dark:text-white ",
                                "justify-start",
                            )}
                            onClick={() => selectItem(item)}
                        >
                            <TokensIcon className="mr-2 h-4 w-4" />
                            {item.title && item.title?.length < 10
                                ? item.title
                                : item.title?.slice(0, 19).concat("...")}
                            {item.members && (
                                <span
                                    className={cn(
                                        "ml-auto",
                                        item.id === focusItemId && "text-background dark:text-white",
                                    )}
                                >
                                    {item.members?.length}
                                </span>
                            )}
                        </Link>
                    ),
                )}
            </>
        );
    };

    return (
        <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {navList(items)}
            </nav>
        </div>
    );
}
