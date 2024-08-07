import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import config from "@/config/constants";
import authProvider from "@/config/authProvider";
import { useNavigate } from "react-router-dom";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useMessenger } from "@/hooks/useMessenger";


const FormSchema = z.object({
  uid: z.string().trim().uuid(),
});

const Login = () => {
  const { login } = authProvider(config.apiUrl);
  const { MessengerDispatch } = useMessengerContext();
  const { messengerActions } = useMessenger();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      uid: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const user = await login(data);
    await messengerActions.updateUserList();
    MessengerDispatch({ type: "update_user", payload: user.item });
    navigate("/chat");
  }

  function loginForm() {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="uid"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="your secret key..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign in to chat</CardTitle>
        <CardDescription>Enter your secret key to continue.</CardDescription>
      </CardHeader>
      <CardContent>{loginForm()}</CardContent>
      <CardFooter>
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          New to Chat?{" "}
          <a
            href="/signup"
            className="font-medium underline underline-offset-4"
          >
            Create an account
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
