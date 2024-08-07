import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TooltipProvider } from "@/components/ui/tooltip";

import MessageList from "./MessageList";
import { Nav } from "./Nav";

import MessageInputArea from "./MessageInputArea";
import { TMessageObject } from "@/config/interfaces";
import { TUser } from "../MessengerScreen/interfaces";

interface MailProps {
  channelId: string;
  userUid: string;
  messages: TMessageObject[];
  users: TUser[] | undefined;
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Chat({
  channelId: channelId,
  userUid: userId,
  messages: messages,
  users: users,
  defaultLayout = [20, 50, 30],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
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
          {/* <Nav
            isCollapsed={isCollapsed}
          /> */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <MessageList items={messages} userUid={userId} />
          <MessageInputArea userId={userId} channelId={channelId} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <Tabs defaultValue="users">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">List</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="users"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="channels"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Channels
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="users" className="m-0">
              {/* <UserList items={users} /> */}
            </TabsContent>
            <TabsContent value="channels" className="m-0">
              {/* <ChannelList items={channels} /> */}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
