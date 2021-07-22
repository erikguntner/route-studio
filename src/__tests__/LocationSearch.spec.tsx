import {LocationSearch} from '../features/CreatePage/LocationSearch';
import {locations} from '../utils/test/data';
import {server, rest} from '../utils/test/server';
import {render, screen, userEvent, waitFor} from '../utils/test/test-utils';

describe('LocationSearch', () => {
  it('displays search results', async () => {
    const query = 'Claremont';
    render(<LocationSearch />);

    const input = screen.getByRole('combobox', {name: /locations/i});
    userEvent.type(input, query);
    await waitFor(() =>
      // getByRole throws an error if it cannot find an element
      screen.getByRole('listbox'),
    );
    // screen.debug();
    expect(screen.getAllByRole('option')).toHaveLength(locations.length);
    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument();
  });

  it('displays empty state when no results are returned', async () => {
    const query = 'Claremont';
    render(<LocationSearch />);

    server.use(
      rest.get(
        'https://nominatim.openstreetmap.org/search',
        (req, res, ctx) => {
          return res(ctx.json([]));
        },
      ),
    );

    const input = screen.getByRole('combobox', {name: /locations/i});
    userEvent.type(input, query);
    await waitFor(() => screen.getByText(/no results/i));

    expect(screen.getByText(/no results/i)).toBeInTheDocument();
    expect(
      screen.queryByText(locations[0].display_name),
    ).not.toBeInTheDocument();
  });
});
