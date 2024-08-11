import { cn } from "@/lib/utils";
import { PersonIcon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Search } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useEffect, useState } from "react";
import { useMessenger } from "@/hooks/useMessenger";
import { TUserObject } from "@/config/interfaces";

export const resource = "users";

export function UserList() {
    const { users: allUsers } = useMessengerContext().MessengerState;
    const { messengerActions } = useMessenger();

    const [targetList, setTargetList] = useState<TUserObject[]>([]);
    const [promt, setPromt] = useState<string>("");

    useEffect(() => {
        allUsers && setTargetList(allUsers);
    }, [allUsers]);

    const searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const promt = e.currentTarget.value;
        setPromt(promt);
        search(promt);
    };

    const search = (promt: string) => {
        const newList = allUsers?.filter(e => {
            return e.username?.includes(promt);
        });

        newList && setTargetList(newList);
    };

    useEffect(() => {
        messengerActions.updateUserList();
    }, []);

    function showUsers(filter: boolean) {
        return (
            <Table>
                <TableBody>
                    {allUsers.map((item, key) => {
                        let username;
                        if (item?.username && promt && promt?.length !== 0) {
                            username = item?.username.replace(
                                new RegExp(promt, "g"),
                                '<span class="text-blue-500">' + promt + "</span>",
                            );
                        } else {
                            username = item.username;
                        }

                        return (
                            (item.online || filter) && (
                                <TableRow key={key}>
                                    {username && (
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
                                            <div dangerouslySetInnerHTML={{ __html: username }}></div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                        );
                    })}
                </TableBody>
            </Table>
        );
    }

    const userList = (list: TUserObject[], filter: boolean) => {
        return (
            <>
                {list && list.length !== 0 ? (
                    <ScrollArea className="h-[410px]">{showUsers(filter)}</ScrollArea>
                ) : (
                    <div className="h-[410px] space-y-6 px-2 py-4">
                        <div className="flex flex-row items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Users not found 💔</p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <Card className="w-[345px]">
            <Tabs defaultValue="online">
                <div className="flex items-center px-4 py-2">
                    <h1 className="text-xl font-bold">Users</h1>
                    <TabsList className="ml-auto">
                        <TabsTrigger value="online" className="text-zinc-600 dark:text-zinc-200">
                            Online
                        </TabsTrigger>
                        <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                            All
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
                <TabsContent value="online" className="m-0">
                    {userList(targetList, false)}
                </TabsContent>
                <TabsContent value="all" className="m-0">
                    {userList(targetList, true)}
                </TabsContent>
            </Tabs>
        </Card>
    );
}
