import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

import config from "@/config/constants";
import authProvider from "@/config/authProvider";
import { useNavigate } from "react-router-dom";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useEffect, useState } from "react";
import { useMessenger } from "@/hooks/useMessenger";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FormSchema = z.object({
    uid: z.string().max(36),
    username: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(50, {
            message: "The user name must contain no more than 50 characters.",
        }),
});

const CreateUser = () => {
    const { MessengerDispatch } = useMessengerContext();
    const { messengerActions } = useMessenger();
    const { signup } = authProvider(config.apiUrl);
    const navigate = useNavigate();
    const [generatedUid, setUuid] = useState<string>("");

    useEffect(() => {
        setUuid(v4());
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            uid: "",
            username: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        data.uid = generatedUid;
        await signup(data);
        await messengerActions.updateUserList();
        MessengerDispatch({ type: "update_user", payload: data });
        navigate("/chat");
    }

    function copyToClipboard() {
        const [hasCopied, setHasCopied] = useState(false);

        function tooltipClick(e: { preventDefault: () => void }) {
            e.preventDefault();
            navigator.clipboard.writeText(generatedUid);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 5000);
        }

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={tooltipClick}>
                            {!hasCopied ? (
                                <CopyIcon className="h-4 w-4 text-stone-600" />
                            ) : (
                                <CheckIcon className="h-4 w-4 text-green-600" />
                            )}
                            <span className="sr-only">Copy</span>
                        </Button>
                    </TooltipTrigger>
                    {!hasCopied ? (
                        <TooltipContent className="text-xs">Copy url to clipboard</TooltipContent>
                    ) : (
                        <TooltipContent className="text-xs">Copied!</TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        );
    }

    function signupForm() {
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Alex..." {...field} />
                                </FormControl>
                                <FormDescription>This is your public display name.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="uid"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex flex-row gap-2 items-center">
                                        <Input {...field} value={generatedUid} disabled />
                                        {copyToClipboard()}
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Your account will be assigned a generated secret key. Please, save it to log is
                                    again.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit">Next</Button>
                    </div>
                </form>
            </Form>
        );
    }

    return (
        <Card className="w-[390px]">
            <CardHeader>
                <CardTitle>Let's start</CardTitle>
                <CardDescription>Enter your name to continue.</CardDescription>
            </CardHeader>
            <CardContent>{signupForm()}</CardContent>
        </Card>
    );
};

export default CreateUser;
