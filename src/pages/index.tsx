import Link from 'next/link';
import styled from 'styled-components';
import {useSession} from 'next-auth/client';

export default function Home() {
  const [session] = useSession();

  return (
    <Container>
      {!session ? (
        <>
          <h1>Not signed in</h1>
        </>
      ) : (
        <>
          <Title>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </Title>
          <p>Signed In as {session.user?.email}</p>
          <p>You can now access super secret pages</p>
          <Link href="/secret">
            <a>Secret Page</a>
          </Link>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  color: ${props => props.theme.colors.primary};
`;
