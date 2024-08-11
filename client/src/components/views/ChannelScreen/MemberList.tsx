import { Cross2Icon } from "@radix-ui/react-icons";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Search } from "lucide-react";
import { TUserObject } from "@/config/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const resource = "users";

interface MemberListProps {
    items: TUserObject[] | undefined;
    excludeMember: (member: TUserObject) => void;
    isOwner: boolean;
}

export function MemberList(props: MemberListProps) {
    const { items, excludeMember, isOwner } = props;

    const [targetList, setTargetList] = useState<TUserObject[]>([]);
    const [promt, setPromt] = useState<string>("");

    useEffect(() => {
        items && setTargetList(items);
    }, [items]);

    const searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const promt = e.currentTarget.value;
        setPromt(promt);
        search(promt);
    };

    const search = (promt: string) => {
        const newList = items?.filter(e => {
            return e.username?.includes(promt);
        });

        newList && setTargetList(newList);
    };

    function showUsers(list: TUserObject[], promt?: string) {
        return (
            <>
                {list.map((item, key) => {
                    let username;
                    if (item?.username && promt && promt?.length !== 0) {
                        username = item?.username.replace(
                            new RegExp(promt, "g"),
                            '<span class="text-red-500">' + promt + "</span>",
                        );
                    } else {
                        username = item.username;
                    }

                    return (
                        <div key={key} className="space-y-6 px-2 py-4 bg-green-50">
                            <div className="flex flex-row items-center">
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                    <AvatarFallback>OM</AvatarFallback>
                                </Avatar>

                                <div className="ml-4 space-y-1">
                                    {username && (
                                        <div
                                            className="text-sm font-medium leading-none"
                                            dangerouslySetInnerHTML={{ __html: username }}
                                        ></div>
                                    )}
                                </div>

                                {isOwner && (
                                    <Button
                                        variant="ghost"
                                        size="default"
                                        className="self-center"
                                        onClick={() => {
                                            setPromt("");
                                            excludeMember(item);
                                        }}
                                    >
                                        <Cross2Icon className="h-4 w-4 text-red-600" />
                                        <span className="sr-only">Move to trash</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }

    const userList = (list: TUserObject[] | undefined, promt?: string) => {
        return (
            <>
                {list && list.length !== 0 ? (
                    <ScrollArea className="h-[410px]">{showUsers(list, promt)}</ScrollArea>
                ) : (
                    <div className="space-y-6 px-2 py-4">
                        <div className="flex flex-row items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">There are no users 💔</p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <Tabs defaultValue="online">
            <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">Members</h1>
            </div>
            <Separator />
            <div className="p-4 backdrop-blur">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search" className="pl-8" onInput={searchHandler} value={promt} />
                    </div>
                </form>
            </div>
            <TabsContent value="online" className="m-0">
                {userList(targetList, promt)}
            </TabsContent>
        </Tabs>
    );
}
