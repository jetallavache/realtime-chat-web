import { PersonIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import {
  Card,
} from "@/components/ui/card";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useEffect } from "react";
import { useMessenger } from "@/hooks/useMessenger";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Search } from "lucide-react";
import { TUserObject } from "@/config/interfaces";

export const resource = "users";

export function ListUsers() {
  const { users: allUsers } = useMessengerContext().MessengerState;

  const { messengerActions } = useMessenger();

  useEffect(() => {
    messengerActions.updateUserList();
  }, []);

  function showUsers(filter: boolean) {
    return (
      <Table>
        <TableBody>
          {allUsers.map((item, key) => (
            (item.online || filter) && <TableRow key={key}>
              <TableCell
                className={cn(
                  "text-clip flex flex-justify items-center",
                  item.online === true ? "bg-emerald-50" : "bg-stone-50",
                )}
              >
                <PersonIcon
                  className={cn(
                    "mr-1 h-3 w-3",
                    item.online === true
                      ? "fill-sky-400 text-sky-400"
                      : "fill-red-400 text-red-400",
                  )}
                />
                {item.username}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  const userList = (list : TUserObject[], filter: boolean) => {

    return (
      <>
          {list && list.length !== 0 ? (
            <ScrollArea className="h-[410px]">{showUsers(filter)}</ScrollArea>
          ) : (
            <p>No Data</p>
          )}
      </>
    )
  } 

  return (
    <Card className="min-w-[200px]">
      <Tabs defaultValue="online">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Users</h1>
              <TabsList className="ml-auto">
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
            <TabsContent value="online" className="m-0">
              {userList(allUsers, false)}
            </TabsContent>
            <TabsContent value="all" className="m-0">
              {userList(allUsers, true)}
            </TabsContent>
          </Tabs>
    </Card>
  );
}
