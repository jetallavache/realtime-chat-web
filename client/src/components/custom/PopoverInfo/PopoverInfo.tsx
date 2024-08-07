import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SocketInfo } from "@/components/custom/SocketInfo";

const PopoverInfo = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Connection</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <SocketInfo />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverInfo;
