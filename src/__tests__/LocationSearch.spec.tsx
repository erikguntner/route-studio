import {LocationSearch} from '../features/CreatePage/LocationSearch';
import {locations} from '../utils/test/data';
import {server, rest} from '../utils/test/server';
import {render, screen, userEvent, waitFor} from '../utils/test/test-utils';

const customRender = () => {
  const onSelect = jest.fn();
  render(<LocationSearch onSelect={onSelect} />);

  return {onSelect};
};

describe('LocationSearch', () => {
  test('displays search results', async () => {
    const query = 'Claremont';
    customRender();

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

  test('displays empty state when no results are returned', async () => {
    const query = 'Claremont';
    customRender();

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

  test('calls onSelect handler when option is clicked', async () => {
    const query = 'Claremont';
    const {onSelect} = customRender();

    const input = screen.getByRole('combobox', {name: /locations/i});
    userEvent.type(input, query);
    await waitFor(() =>
      // getByRole throws an error if it cannot find an element
      screen.getByRole('listbox'),
    );

    const options = screen.getAllByRole('option');
    userEvent.click(options[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
