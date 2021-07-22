import {rest} from 'msw';
import {locations} from './data';

const handlers = [
  rest.get('https://nominatim.openstreetmap.org/search', (req, res, ctx) => {
    return res(ctx.json(locations));
  }),
];

export {handlers};
