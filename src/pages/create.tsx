// import dynamic from 'next/dynamic';
import {CreatePageMapbox} from '../features/CreatePage/CreatePageMapbox';

const Create = () => {
  // const CreatePage = dynamic(
  //   () => import('../features/CreatePage/CreatePage'),
  //   {
  //     ssr: false,
  //   },
  // );
  return <CreatePageMapbox />;
};

export default Create;
