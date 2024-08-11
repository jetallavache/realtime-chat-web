import React, { PropsWithChildren } from "react";
import { Separator } from "@/components/ui/separator";
import Footer from "./Footer";
import Header from "./Header";

export interface ILayoutProps extends PropsWithChildren {}

const Layout: React.FunctionComponent<ILayoutProps> = props => {
    const { children } = props;

    return (
        <div className="h-full flex-col md:flex">
            <Header />
            <section className="min-h-[560px] flex justify-center bg-zinc-50">{children}</section>
            <Separator />
            <Footer />
        </div>
    );
};

export default Layout;
