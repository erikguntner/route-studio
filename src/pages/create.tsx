import dynamic from 'next/dynamic';

const Create = () => {
  const CreatePage = dynamic(() => import('../components/CreatePage'), {
    ssr: false,
  });
  return <CreatePage />;
};

export default Create;
