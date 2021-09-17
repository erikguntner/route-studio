import {render, screen} from '../utils/test/test-utils';
import {useSession} from 'next-auth/react';
import {Header} from '../features/Layout/Header';
import {Session} from 'next-auth';
jest.mock('next-auth/react');

//TODO: update to use new useSession API
const setup = (config: [Session | null, boolean]) => {
  (useSession as jest.Mock).mockReturnValueOnce(config);
  render(<Header />);
};

describe('Nav component', () => {
  test('Renders Sign In button when session exists', () => {
    //TODO: update to use new useSession API
    setup([null, false]);

    expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
    expect(
      screen.queryByRole('link', {name: /sign out/i}),
    ).not.toBeInTheDocument();
  });

  it('Renders Sign Out button when a session exists', () => {
    //TODO: update to use new useSession API
    setup([{}, false]);

    expect(
      screen.queryByRole('button', {name: /sign in/i}),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: /sign out/i})).toBeInTheDocument();
  });
});
