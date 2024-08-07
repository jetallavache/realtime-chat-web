import React, { useContext } from "react";

import { PersonIcon, RocketIcon, CaretRightIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SocketContext from "@/contexts/Socket/Context";
import { ISocketInfoProps } from "./interfaces";

const SocketInfo: React.FunctionComponent<ISocketInfoProps> = (_props) => {
  const { socket, clientId, clients, status } = useContext(SocketContext).SocketState;

  return (
    <Card className="">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          {/* <CardTitle>Information</CardTitle> */}
          <CardDescription>
            Connection status: <strong>{status}</strong>
          </CardDescription>
          {status === "connected" && (
            <CardDescription>
              There are currently <strong>{clients.length} active users</strong>{" "}
              on the site.
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <PersonIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            Client
          </div>
          <div className="flex items-center">
            <CaretRightIcon className="mr-1 h-3 w-3" />
            id:
          </div>
          <div className="col-span-4">{clientId.length === 0 ? "—" : clientId}</div>

          <div className="flex items-center">
            <RocketIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            Socket
          </div>
          <div className="flex items-center">
            <CaretRightIcon className="mr-1 h-3 w-3" />
            id:
          </div>
          <div className="col-span-4">{socket?.id ? socket.id : "—"}</div>
        </div>

        {/* <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowTopRightIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            Socket
          </div>
          <div className="flex items-center">
            <CaretRightIcon className="mr-1 h-3 w-3" />
            id:
          </div>
          <div>{socket?.id ? socket.id : '—'}</div>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default SocketInfo;

{
  /* <p>
        Your user ID: <strong>{uid}</strong>
        <br />
        Users online: <strong>{users.length}</strong>
        <br />
        Socket ID: <strong>{socket?.id}</strong>
        <br />
      </p> */
}
