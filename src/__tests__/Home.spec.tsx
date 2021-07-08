import {render, screen} from '../utils/test/test-utils';
import Home from '../pages/index';
import {useSession} from 'next-auth/client';
jest.mock('next-auth/client');

describe('Home Page', () => {
  it('Renders correctly when signed out', () => {
    (useSession as jest.Mock).mockReturnValueOnce([null, false]);

    render(<Home />);

    expect(screen.getByText(/not signed in/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /Welcome to Next.js/i, level: 1}),
    ).not.toBeInTheDocument();
  });
});
