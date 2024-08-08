import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import {
  Tabs,
  TabsContent,

} from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area";

import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Search } from "lucide-react";
import { TUserObject } from "@/config/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const resource = "users";

interface MemberListProps {
  items: TUserObject[] | undefined;
  excludeMember: (member: TUserObject) => void;
  isOwner: boolean;
}

export function MemberList(props: MemberListProps) {
  const { items, excludeMember, isOwner } = props;

  function showUsers(list : TUserObject[]) {
    return (
      <>
          {list.map((item, key) => (
            <div key={key} className="space-y-6 px-2 py-4 bg-green-50">
              <div className="flex flex-row items-center">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.username}</p>
                </div>
                {isOwner && <Button variant="ghost" size="icon" className="self-end" onClick={() => excludeMember(item)}>
                  <Cross2Icon className="h-4 w-4" />
                  <span className="sr-only">Move to trash</span>
                </Button>}
              </div>
            </div>
          ))}
      </>
    );
  }

  const userList = (list : TUserObject[] | undefined) => {

    return (
      <>
          {list && list.length !== 0 ? (
            <ScrollArea className="h-[410px]">{showUsers(list)}</ScrollArea>
          ) : (
            <p>No Data</p>
          )}
      </>
    )
  } 

  return (
    <Tabs defaultValue="online">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Users</h1>
              {/* <TabsList className="ml-auto">
                <TabsTrigger
                  value="online"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Online
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All
                </TabsTrigger>
              </TabsList> */}
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
            <TabsContent value="online" className="m-0">
              {userList(items)}
            </TabsContent>
          </Tabs>
  );
}
