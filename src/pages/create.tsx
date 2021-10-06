import dynamic from 'next/dynamic';
// import {CreatePageMapbox} from '../features/CreatePage/CreatePageMapbox';

const Create = () => {
  const CreatePage = dynamic(
    () => import('../features/CreatePage/CreatePageMapbox'),
    {
      ssr: true,
    },
  );
  return <CreatePage />;
};

export default Create;
