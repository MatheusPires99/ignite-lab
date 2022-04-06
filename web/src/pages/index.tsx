import { GetServerSideProps } from 'next';

import { getSession } from '@auth0/nextjs-auth0';

const Home = () => {
  return <h1>Home</h1>;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: '/app',
      permanent: false,
    },
  };
};
