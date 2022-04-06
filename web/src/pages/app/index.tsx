import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

const App = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>App</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default App;

export const getServerSideProps = withPageAuthRequired();
