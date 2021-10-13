import {render, screen} from '../utils/test/test-utils';
import {
  ElevationGraphPortal,
  ElevationGraphPortalProps,
} from '../features/CreatePage/ElevationGraphPortal';
import {ElevationGraph, ElevationGraphProps} from '../features/ElevationGraph';

type CombinedProps = ElevationGraphPortalProps & ElevationGraphProps;

const setup = (config: Partial<CombinedProps> = {}) => {
  const props: CombinedProps = {
    open: true,
    lines: [],
    units: 'meters',
    setDistanceAlongPath: jest.fn(),
    ...config,
  };

  const {lines, open, setDistanceAlongPath, units} = props;

  render(
    <ElevationGraphPortal open={open} lines={lines}>
      <ElevationGraph
        lines={lines}
        units={units}
        setDistanceAlongPath={setDistanceAlongPath}
      />
    </ElevationGraphPortal>,
  );
};

describe('Elevation Graph Portal', () => {
  test('Renders text if no eleavtion data exists', () => {
    setup();
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.queryByTestId('elevation-profile')).not.toBeInTheDocument();
  });
  test('Renders chart if eleavtion data exists', () => {
    setup({
      lines: [
        [
          [-0.10631, 51.50716, 17.44],
          [-0.104694, 51.507143, 19.7],
          [-0.104694, 51.507082, 19.88],
          [-0.104665, 51.507079, 19.95],
        ],
      ],
    });
    expect(screen.getByTestId('elevation-profile')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
