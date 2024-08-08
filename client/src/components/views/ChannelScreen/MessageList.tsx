import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { CaretRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { parseISO } from "date-fns/parseISO";
import { format } from "date-fns/format";
import { useRef, useEffect } from "react";
import { TMessageObject } from "@/config/interfaces";
import { TUser } from "../MessengerScreen/interfaces";

interface MessageListProps {
  items: TMessageObject[];
  userUid: string | undefined;
}

const MessageList = ({ items, userUid }: MessageListProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

  }, [items]);
  
  return (
    <>
      {items && (
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col p-4 pt-0">
            <>
              {items.map((item, index) => (
                <Card
                  className={cn(
                    "m-1 p-2 w-[300px]",
                    (item?.from as TUser).uid === userUid
                      ? "self-end bg-green-100"
                      : "bg-slate-100",
                  )}
                  key={index}
                >
                  <CardHeader className="flex flex-col p-0 m-0">
                    <div
                      className={cn(
                        "flex space-x-1",
                        (item?.from as TUser).uid === userUid
                          ? "flex-end justify-end"
                          : "flex-start",
                      )}
                    >
                      <CardDescription>
                        {item.timestamp &&
                          format(
                            parseISO(item.timestamp as string),
                            "d LLL, HH:mm",
                          )}
                      </CardDescription>
                      {(item?.from as TUser).uid !== userUid && (
                        <CardDescription className="flex flex-start space-x-1 items-center">
                          <CaretRightIcon />
                          {(item?.from as TUser).username}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 m-0">{item.content}</CardContent>
                </Card>
              ))}
              <div ref={messagesEndRef} />
            </>
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default MessageList;
