import {render, screen} from '../utils/test/test-utils';
import {useSession, SessionContextValue} from 'next-auth/react';
import {Header} from '../features/Layout/Header';
jest.mock('next-auth/react');

const setup = (config: SessionContextValue) => {
  (useSession as jest.Mock).mockReturnValueOnce(config);
  render(<Header />);
};

describe('Nav component', () => {
  test('Renders Sign In button when no session exists', () => {
    setup({data: null, status: 'unauthenticated'});

    expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
    expect(
      screen.queryByRole('link', {name: /sign out/i}),
    ).not.toBeInTheDocument();
  });

  it('Renders Sign Out button when a session exists', () => {
    setup({data: {}, status: 'authenticated'});

    expect(
      screen.queryByRole('button', {name: /sign in/i}),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: /sign out/i})).toBeInTheDocument();
  });
});
