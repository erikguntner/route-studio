import {GetServerSideProps} from 'next';
import {ClientSafeProvider, getProviders, signIn} from 'next-auth/client';
import {useState} from 'react';
import styled from 'styled-components';

interface Props {
  providers: Record<string, ClientSafeProvider> | null;
}

const SignIn = ({providers}: Props) => {
  const [email, setEmail] = useState('');
  return (
    <Container>
      <form
        onSubmit={async e => {
          e.preventDefault();
          signIn('email', {email, callbackUrl: '/'});
        }}
      >
        <label>
          Email Address{' '}
          <input
            type="email"
            id="email"
            name="email"
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Sign In with Email</button>
      </form>
      <div>or</div>
      <div>
        {providers
          ? Object.values(providers)
              .filter(({name}) => name !== 'Email')
              .map(({name, id}) => {
                return (
                  <div key={name}>
                    <button onClick={() => signIn(id, {callbackUrl: '/'})}>
                      Sign in with {name}
                    </button>
                  </div>
                );
              })
          : null}
      </div>
    </Container>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {providers},
  };
};

const Container = styled.div`
  max-width: 50rem;
  margin: 0 auto;
`;
