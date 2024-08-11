'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { useNavigate } from 'react-router-dom';
import { useMessenger } from '@/hooks/useMessenger';
import authProvider from '@/config/authProvider';
import config from '@/config/constants';

export const resource = 'channels';

const FormSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: 'The channel name must be at least 2 characters.',
        })
        .max(50, {
            message: 'The channel name must contain no more than 50 characters.',
        }),
    description: z
        .string()
        .max(200, {
            message: 'The channel description must contain no more than 200 characters.',
        })
        .optional(),
    creatorUid: z.string(),
});

export function CreateChannel() {
    const navigate = useNavigate();
    const { createChannel } = useMessenger().messengerActions;
    const { checkUser } = authProvider(config.apiUrl);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: '',
            description: '',
            creatorUid: '',
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const uid = checkUser()?.data.uid;

        if (uid) {
            const generatedIdChannel = v4();
            data.creatorUid = uid;

            await createChannel({
                id: generatedIdChannel,
                title: data.title,
                description: data.description,
                creator: data.creatorUid,
            });

            console.log('onSubmit', data);
        } else {
            console.log('onSubmit: user not found!');
        }
    }

    async function onSubmitAndFollow(data: z.infer<typeof FormSchema>) {
        const uid = checkUser()?.data.uid;

        if (uid) {
            const generatedIdChannel = v4();
            data.creatorUid = uid;

            await createChannel({
                id: generatedIdChannel,
                title: data.title,
                description: data.description,
                creator: data.creatorUid,
            });

            console.log('onSubmitAndFollow', data);
            navigate(`/chat/${generatedIdChannel}`);
        } else {
            console.log('onSubmitAndFollow: user not found!');
        }
    }

    function createChannelForm() {
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="My group..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="No game, just chat..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public channel. You will be able to edit it.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-2">
                        <Button type="submit">Create</Button>
                        <Button type="button" variant="secondary" onClick={form.handleSubmit(onSubmitAndFollow)}>
                            Create and go in
                        </Button>
                    </div>
                </form>
            </Form>
        );
    }

    return (
        <Card className="min-w-[280px] h-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Create New</CardTitle>
            </CardHeader>
            <CardContent>{createChannelForm()}</CardContent>
        </Card>
    );
}
