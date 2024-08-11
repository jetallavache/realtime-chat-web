import React, { PropsWithChildren } from "react";
import { Separator } from "@/components/ui/separator";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";

export interface ILayoutProps extends PropsWithChildren {}

const Layout: React.FunctionComponent<ILayoutProps> = props => {
    const { children } = props;

    return (
        <div className="h-full flex-col md:flex">
            <Header />
            <section className="min-h-[560px] flex justify-center bg-zinc-50">{children}</section>
            <Separator />
            <Footer />
            <Toaster />
        </div>
    );
};

export default Layout;
