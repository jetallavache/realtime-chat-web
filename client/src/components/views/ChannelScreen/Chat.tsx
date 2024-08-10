import * as React from "react";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

import MessageList from "./MessageList";
import { Nav } from "./Nav";
import MessageInputArea from "./MessageInputArea";
import {
  TChannelObject,
  TMessageObject,
  TUserObject,
} from "@/config/interfaces";
import { MemberList } from "./MemberList";

interface MailProps {
  channelId: string;
  userUid: string | undefined;
  messages: TMessageObject[];
  members: TUserObject[] | undefined;
  channels: TChannelObject[];
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  isOwner: boolean;
  excludeMember: (member: TUserObject) => void;
}

export function Chat({
  channelId: channelId,
  userUid: userId,
  messages: messages,
  members: members,
  defaultLayout = [20, 60, 20],
  defaultCollapsed = false,
  navCollapsedSize,
  isOwner,
  channels,
  excludeMember,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div className="w-screen">
      <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2",
            )}
          ></div>
          <Separator />
          <Nav isCollapsed={isCollapsed} items={channels} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <MessageList items={messages} userUid={userId} />
          <MessageInputArea userId={userId} channelId={channelId} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MemberList
            items={members}
            isOwner={isOwner}
            excludeMember={excludeMember}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
    </div>
  );
}
