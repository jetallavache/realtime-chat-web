import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

import { CaretRightIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { parseISO } from 'date-fns/parseISO';
import { format } from 'date-fns/format';
import { useRef, useEffect } from 'react';
import { TMessageObject } from '@/config/interfaces';
import { TUserObject } from '@/config/interfaces';

interface MessageListProps {
    items: TMessageObject[];
    userUid: string | undefined;
}

const MessageList = ({ items, userUid }: MessageListProps) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [items]);

    return (
        <>
            {items && userUid && (
                <ScrollArea className="h-[460px]">
                    <div className="flex flex-col p-4 pt-0">
                        <>
                            {items.map((item, index) => (
                                <Card
                                    className={cn(
                                        'm-1 p-3 w-[300px] border-0 rounded-3xl',
                                        (item?.from as TUserObject).uid === userUid
                                            ? 'self-end bg-green-100'
                                            : 'bg-slate-100',
                                    )}
                                    key={index}
                                >
                                    <CardHeader className="flex flex-col p-0 m-0">
                                        <div
                                            className={cn(
                                                'flex space-x-1',
                                                (item?.from as TUserObject).uid === userUid
                                                    ? 'flex-end justify-end'
                                                    : 'flex-start',
                                            )}
                                        >
                                            <CardDescription className="text-xs">
                                                {item.timestamp &&
                                                    format(parseISO(item.timestamp as string), 'd LLL, HH:mm')}
                                            </CardDescription>
                                            {(item?.from as TUserObject).uid !== userUid && (
                                                <CardDescription className="flex flex-start space-x-1 items-center text-xs">
                                                    <CaretRightIcon />
                                                    {(item?.from as TUserObject).username}
                                                </CardDescription>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0 m-0">{item.content}</CardContent>
                                </Card>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    </div>
                </ScrollArea>
            )}
        </>
    );
};

export default MessageList;
