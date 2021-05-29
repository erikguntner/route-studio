import {render, screen} from '../utils/test/test-utils';
import Home from '../pages/index';

describe('Home Page', () => {
  it('Renders the header', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {name: /Welcome to Next.js/i, level: 1}),
    ).toBeInTheDocument();
  });
});
