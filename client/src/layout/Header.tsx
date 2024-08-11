import { useNavigate } from 'react-router-dom';
import {
    DotsHorizontalIcon,
    LightningBoltIcon,
    PersonIcon,
    ChevronLeftIcon,
    LockClosedIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import PopoverInfo from '@/components/custom/PopoverInfo/PopoverInfo';
import { useMessengerContext } from '@/contexts/Messenger/Context';
import authProvider from '@/config/authProvider';
import config from '@/config/constants';
import { useMessenger } from '@/hooks/useMessenger';
import { TUserObject } from '@/config/interfaces';

const Header = () => {
    const { MessengerState, MessengerDispatch } = useMessengerContext();
    const { user, channel } = MessengerState;
    const { logout } = authProvider(config.apiUrl);
    const currentPath = window.location.pathname;
    const navigate = useNavigate();
    const { messengerActions } = useMessenger();

    const buttonsGroupLogin = () => {
        return (
            <>
                <PopoverInfo />
            </>
        );
    };

    const buttonsGroupSignup = () => {
        return (
            <>
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Already have an account?{' '}
                    <a
                        onMouseOver={event => (event.currentTarget.style.cursor = 'pointer')}
                        className="font-medium underline underline-offset-4"
                        onClick={() => navigate('/login')}
                    >
                        Sign in
                    </a>
                    .
                </p>
                <PopoverInfo />
            </>
        );
    };

    const buttonsGroupMessenger = () => {
        return (
            <>
                <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={async () => {
                        await messengerActions.exit(user?.uid);
                        logout();
                        MessengerDispatch({ type: 'update_user', payload: null });
                        navigate('/');
                    }}
                >
                    <span>Sign out</span>
                </Button>

                <PopoverInfo />

                <Button variant="secondary">
                    <span className="sr-only">Actions</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
            </>
        );
    };

    const buttonsGroupChannel = () => {
        return (
            <>
                {channel && (
                    <div className="flex flex-start items-center space-x-2">
                        <span className="text-sm text-blue-300">Chat:</span>
                        <span className="text-sm">
                            {channel.title && channel.title.length > 10
                                ? channel.title.slice(0, 10).concat('...')
                                : channel?.title}
                        </span>
                    </div>
                )}

                {channel && (
                    <div className="flex flex-start items-center space-x-2">
                        <LockClosedIcon className="h-4 w-4 text-slate-500" />
                        {(channel?.creator as TUserObject).uid === user?.uid ? (
                            <span className="text-sm text-green-400">You are the owner</span>
                        ) : (
                            <span className="text-sm text-blue-400">
                                Owner: {(channel?.creator as TUserObject).username}
                            </span>
                        )}
                    </div>
                )}

                <Button variant="secondary" className="gap-2" onClick={() => navigate('/chat')}>
                    <ChevronLeftIcon className="h-4 w-4" />
                    <span>Back</span>
                </Button>

                <PopoverInfo />

                <Button variant="secondary">
                    <span className="sr-only">Actions</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
            </>
        );
    };

    const buttonsGroup = (path: string) => {
        return (
            <>
                {(path === '/' || path === '/login') && buttonsGroupLogin()}
                {path === '/signup' && buttonsGroupSignup()}
                {path === '/chat' && buttonsGroupMessenger()}
                {/^\/chat\/[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(path) &&
                    buttonsGroupChannel()}
            </>
        );
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex flex-col items-start justify-between space-x-4 px-6 py-6 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                    <div className="flex flex-start items-center">
                        <span className="text-sm font-semibold">Chat</span>
                        <LightningBoltIcon className="h-4 w-4" />
                    </div>
                    {user?.username && (
                        <div className="flex flex-start items-center space-x-1 rounded-md border-0 bg-stone-100 px-4 py-2">
                            <PersonIcon className="h-4 w-4" />
                            <span className="text-sm font-semibold">{user?.username}</span>
                        </div>
                    )}
                    <div className="ml-auto flex w-full items-center space-x-3 sm:justify-end">
                        {buttonsGroup(currentPath)}
                    </div>
                </div>
                <Separator />
            </header>
        </>
    );
};

export default Header;
