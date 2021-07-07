import {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});

  if (session) {
    res.send({content: 'welcome to the secret page'});
  } else {
    res.send({
      error: 'You need to be signed in',
    });
  }
};
