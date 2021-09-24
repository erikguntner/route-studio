import {render, screen} from '../utils/test/test-utils';
import Home from '../pages/index';
import {useSession} from 'next-auth/react';
jest.mock('next-auth/react');

describe('Home Page', () => {
  test('Renders correctly when signed out', () => {
    //TODO: update to use new useSession API
    (useSession as jest.Mock).mockReturnValueOnce([null, false]);

    render(<Home />);

    expect(screen.getByText(/not signed in/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /Welcome to Next.js/i, level: 1}),
    ).not.toBeInTheDocument();
  });
});
