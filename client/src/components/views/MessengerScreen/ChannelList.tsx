import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useNavigate } from "react-router-dom";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useMessenger } from "@/hooks/useMessenger";
import { TChannelObject, TUserObject } from "@/config/interfaces";
import { ScrollArea } from "@/components/ui/scroll-area";

export const resource = "channels";

export function ChannelList() {
    const navigate = useNavigate();
    const { messengerActions } = useMessenger();
    const { channels } = useMessengerContext().MessengerState;

    const [targetList, setTargetList] = useState<TChannelObject[]>([]);
    const [promt, setPromt] = useState<string>("");

    useEffect(() => {
        channels && setTargetList(channels);
    }, [channels]);

    const searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const promt = e.currentTarget.value;
        setPromt(promt);
        search(promt);
    };

    const search = (promt: string) => {
        const newList = channels?.filter(e => {
            return e.title?.includes(promt);
        });

        newList && setTargetList(newList);
    };

    useEffect(() => {
        messengerActions.updateChannelList();
    }, []);

    function selectItem(id: string) {
        navigate(`/chat/${id}`);
    }

    function tableChannels(list: TChannelObject[]) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Creator</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list
                        .map((item, index) => {
                            let title = item.title;

                            if (title && title?.length > 12) {
                                title = title?.slice(0, 12).concat("...");
                            }

                            if (item?.title && promt && promt?.length !== 0) {
                                title = item?.title.replace(
                                    new RegExp(promt, "g"),
                                    '<span class="text-yellow-500">' + promt + "</span>",
                                );
                            }

                            let owner = (item.creator as TUserObject)
                                ? (item.creator as TUserObject).username
                                : (item.creator as string);

                            return (
                                <TableRow
                                    key={index}
                                    onClick={e => {
                                        e.preventDefault;
                                        item.id && selectItem(item.id);
                                    }}
                                >
                                    {title && (
                                        <TableCell
                                            className="font-medium"
                                            dangerouslySetInnerHTML={{ __html: title }}
                                        ></TableCell>
                                    )}
                                    <TableCell className="text-clip">
                                        {item?.description && item.description.length > 15
                                            ? item.description.slice(0, 15).concat("...")
                                            : item.description}
                                    </TableCell>
                                    <TableCell>
                                        {owner && owner.length > 10 ? owner.slice(0, 10).concat("...") : owner}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                        .reverse()}
                </TableBody>
            </Table>
        );
    }

    const channelList = (list: TChannelObject[]) => {
        return (
            <>
                {list && list.length !== 0 ? (
                    <ScrollArea className="h-[410px]">{tableChannels(list)}</ScrollArea>
                ) : (
                    <div className="h-[410px] space-y-6 px-2 py-4">
                        <div className="flex flex-row items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Channels not found 💔</p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <Card className="w-[345px]">
            <Tabs defaultValue="channels">
                <div className="flex items-center px-4 py-2">
                    <h1 className="text-xl font-bold">Channels</h1>
                    <TabsList className="ml-auto">
                        <TabsTrigger value="channels" className="text-zinc-600 dark:text-zinc-200">
                            *
                        </TabsTrigger>
                    </TabsList>
                </div>
                <Separator />
                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <form>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" onInput={searchHandler} value={promt} />
                        </div>
                    </form>
                </div>
                <TabsContent value="channels" className="m-0">
                    {channelList(targetList)}
                </TabsContent>
            </Tabs>
        </Card>
    );
}
