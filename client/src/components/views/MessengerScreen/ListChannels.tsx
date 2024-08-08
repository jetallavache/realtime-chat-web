import { useEffect, useState } from "react";

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// import dataProvider from "@/config/dataProvider";
// import config from "@/config/constants";
import { useNavigate } from "react-router-dom";
// import { TChannelObject } from "@/config/interfaces";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useMessenger } from "@/hooks/useMessenger";
import { TUser } from "./interfaces";
import { TUserObject } from "@/config/interfaces";

export const resource = "channels";

export function ListChannels() {
  // const { getList } = dataProvider(config.apiUrl);

  const navigate = useNavigate();
  const { messengerActions } = useMessenger();

  const { channels } = useMessengerContext().MessengerState;

  const [loading] = useState(false);
  // const [oldChannels, setOldChannels] = useState<TChannelObject[]>([]);

  // async function fetch(resource: string) {
  //   setLoading(true);

  //   try {
  //     getList(resource, { id: "" })
  //       .then((result): TChannelObject[] => {

  //         return result.items.map((item) => ({
  //           id: item.id,
  //           creator: item?.creator?.username,
  //           countMembers: item?.countMembers ? item.countMembers : 0,
  //           title: item.title,
  //           description: item.description,
  //         }));
  //       })
  //       .then((allChannels) => {
  //         const currentUsersSet = new Set(
  //           currnetChannels.map((e) => JSON.stringify(e)),
  //         );
  //         return allChannels.filter(
  //           (e) => !currentUsersSet.has(JSON.stringify(e)),
  //         );
  //       })
  //       .then((oldChannels) => {
  //         setOldChannels(oldChannels);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  useEffect(() => {
    messengerActions.updateChannelList();
  }, []);

  function selectItem(id: string) {
    navigate(`/chat/${id}`);
  }

  function tableChannelsSceleton() {
    return (
      <div className="flex flex-col h-80 min-w-[300px] space-y-4">
        <Skeleton className="h-[38px] w-full" />
        <Skeleton className="h-[38px] w-full" />
        <Skeleton className="h-[38px] w-full" />
        <Skeleton className="h-[38px] w-full" />
        <Skeleton className="h-[38px] w-full" />
      </div>
    );
  }

  function tableChannels() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Creator</TableHead>
            {/* <TableHead>Online</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {channels
            .map((item, index) => (
              <TableRow
                className="bg-blue-50"
                key={index}
                onClick={(e) => {
                  e.preventDefault;
                  item.id && selectItem(item.id);
                }}
              >
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-clip">{item.description}</TableCell>
                <TableCell>
                  {item.creator as TUserObject ? (item.creator as TUserObject).username : (item.creator as string)}
                </TableCell>
                {/* <TableCell>{item.countMembers}</TableCell> */}
              </TableRow>
            ))
            .reverse()}

          {
            // oldChannels.map((item, index) => (
            //   <TableRow
            //     key={index}
            //     onClick={(e) => {
            //       e.preventDefault;
            //       item.id && selectItem(item.id);
            //     }}
            //   >
            //     <TableCell className="font-medium">{item.title}</TableCell>
            //     <TableCell className="text-clip">{item.description}</TableCell>
            //     <TableCell>
            //       {item.creator && typeof item.creator === "string"
            //         ? item.creator
            //         : ""}{" "}
            //     </TableCell>
            //     {/* <TableCell>{item.countMembers}</TableCell> */}
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
        <CardTitle className="text-xl font-bold">Channels</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          tableChannelsSceleton()
        ) : channels.length !== 0 ? (
          <ScrollArea className="h-[440px]">{tableChannels()}</ScrollArea>
        ) : (
          <p>No Data</p>
        )}
      </CardContent>
      <CardDescription></CardDescription>
    </Card>
  );
}
