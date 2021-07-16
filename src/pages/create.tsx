import dynamic from 'next/dynamic';

const Create = () => {
  const CreatePage = dynamic(
    () => import('../features/CreatePage/CreatePage'),
    {
      ssr: false,
    },
  );
  return <CreatePage />;
};

export default Create;
