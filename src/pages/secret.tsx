import {useSession} from 'next-auth/react';
import {useState, useEffect} from 'react';

const Secret = () => {
  const {data: session, status} = useSession();
  const [content, setContent] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/secret');
      const json = await res.json();

      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  if (typeof window !== 'undefined' && status === 'loading') return null;

  if (!session) {
    return (
      <main>
        <div>
          <h1>You arent signed in please sign in first</h1>
        </div>
      </main>
    );
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>{content}</p>
    </div>
  );
};

export default Secret;
