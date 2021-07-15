import {render, screen} from '../utils/test/test-utils';
import {useSession} from 'next-auth/client';
import {Nav} from '../components/Header';
import {Session} from 'next-auth';
jest.mock('next-auth/client');

const setup = (config: [Session | null, boolean]) => {
  (useSession as jest.Mock).mockReturnValueOnce(config);
  render(<Nav />);
};

describe('Nav component', () => {
  it('Renders Sign In button when session exists', () => {
    setup([null, false]);

    expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
    expect(
      screen.queryByRole('link', {name: /sign out/i}),
    ).not.toBeInTheDocument();
  });

  it('Renders Sign Out button when a session exists', () => {
    setup([{}, false]);

    expect(
      screen.queryByRole('button', {name: /sign in/i}),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: /sign out/i})).toBeInTheDocument();
  });
});
