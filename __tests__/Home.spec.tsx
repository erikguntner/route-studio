import {render} from '@testing-library/react';
import Home from '../pages/index';

describe('Home Page', () => {
  it('Renders the header', () => {
    const {getByRole} = render(<Home />);
    expect(getByRole('heading', {level: 1})).toHaveTextContent(
      /Welcome to Next.js/i,
    );
  });
});
