import {render, screen} from '../utils/test/test-utils';
import {useSession} from 'next-auth/client';
import {Header} from '../features/Layout/Header';
import {Session} from 'next-auth';
jest.mock('next-auth/client');

const setup = (config: [Session | null, boolean]) => {
  (useSession as jest.Mock).mockReturnValueOnce(config);
  render(<Header />);
};

describe('Nav component', () => {
  test('Renders Sign In button when session exists', () => {
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
