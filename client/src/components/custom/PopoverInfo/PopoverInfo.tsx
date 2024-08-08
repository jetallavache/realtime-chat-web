import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SocketInfo } from "@/components/custom/SocketInfo";
import SocketContext from "@/contexts/Socket/Context";
import { useContext } from "react";
import { cn } from "@/lib/utils";

const PopoverInfo = () => {
  const { SocketState } = useContext(SocketContext);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn(SocketState.socket?.id ? "" : "text-red-500")}
        >
          Connection
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <SocketInfo />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverInfo;
