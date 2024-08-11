import config from '@/config/constants';

const { __VERESION__: version } = config;

const Footer = () => {
    return (
        <footer className="py-4 sm:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 sm:h-20 sm:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground sm:text-left">
                    The source code is available on{' '}
                    <a
                        href="https://github.com/jetallavache/real-time-chat.git"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        GitHub
                    </a>
                    .
                </p>
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground sm:text-left">
                    Version {version}
                    {/* <a
            // href=""
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {version}
          </a> */}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
