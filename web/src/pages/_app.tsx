import type { AppProps } from 'next/app';

import { UserProvider } from '@auth0/nextjs-auth0';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
};

export default MyApp;
