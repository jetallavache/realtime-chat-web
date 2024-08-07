import { PersonIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea } from "@/components/ui/scroll-area";
// import { useSocketContext } from "@/contexts/Socket/Context";
// import { useEffect, useState } from "react";
// import dataProvider from "@/config/dataProvider";
// import config from "@/config/constants";
// import { TUser } from "./interfaces";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useEffect } from "react";
import { useMessenger } from "@/hooks/useMessenger";

export const resource = "users";

// type TUser = {
//   uid?: string;
//   username?: string;
// }

export function ListUsers() {
  const { users: onlineUsers } = useMessengerContext().MessengerState;

  const { messengerActions } = useMessenger();
  
  useEffect(() => {
    messengerActions.updateUserList();
  }, []);
  // const [offlineUsers, setOfflineUsers] = useState<TUser[]>([]);

  // const { getList } = dataProvider(config.apiUrl);

  // async function fetch(resource: string) {
  //   try {
  //     getList(resource, { id: "" })
  //       .then((result): TUser[] => {
  //         return result.items.map((item) => ({
  //           uid: item.uid,
  //           username: item.username,
  //         }));
  //       })
  //       .then((allUsers) => {
  //         const onlineUsersSet = new Set(
  //           onlineUsers.map((e) => JSON.stringify(e)),
  //         );
  //         return allUsers.filter((e) => !onlineUsersSet.has(JSON.stringify(e)));
  //       })
  //       .then((offline) => {
  //         setOfflineUsers(offline);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   fetch(resource);
  // }, [onlineUsers]);

  function tableUsers() {
    return (
      <Table>
        <TableBody>
          {onlineUsers.map((item, key) => (
            <TableRow key={key}>
              <TableCell
                className={cn(
                  "text-clip flex flex-justify items-center",
                  item.online === true
                    ? "bg-emerald-50"
                    : "bg-stone-50",
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
          {
          // offlineUsers.map((item, key) => (
          //   <TableRow key={key}>
          //     <TableCell className="text-clip flex flex-justify items-center bg-stone-50">
          //       <PersonIcon className="mr-1 h-3 w-3 fill-red-400 text-red-400" />
          //       {item.username}
          //     </TableCell>
          //   </TableRow>
          // ))
          }
        </TableBody>
      </Table>
    );
  }

  return (
    <Card className="min-w-[200px]">
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {(onlineUsers && onlineUsers.length !== 0) ? (
          <ScrollArea className="h-80">{tableUsers()}</ScrollArea>
        ) : (
          <p>No Data</p>
        )}
      </CardContent>
      <CardDescription></CardDescription>
    </Card>
  );
}
