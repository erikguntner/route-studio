export interface Data {
  hints: Hints;
  info: Info;
  paths: Path[];
  lineIndices: number[];
  index: number;
}

export interface Hints {
  'visited_nodes.sum': number;
  'visited_nodes.average': number;
}

export interface Info {
  copyrights: string[];
  took: number;
}

export interface Path {
  distance: number;
  weight: number;
  time: number;
  transfers: number;
  points_encoded: boolean;
  bbox: number[];
  points: Points;
  instructions: Instruction[];
  legs: string[];
  details: string[];
  ascend: number;
  descend: number;
  snapped_waypoints: Points;
}

export interface Instruction {
  distance: number;
  heading?: number;
  sign: number;
  interval: number[];
  text: string;
  time: number;
  street_name: string;
  last_heading?: number;
}

export interface Points {
  type: string;
  coordinates: Array<number[]>;
}

interface Args {
  points: number[][];
}

export const graphHopperApi = async ({
  points,
}: Args): Promise<{
  response: Response;
  data: Omit<Data, 'lineIndices' | 'index'>;
}> => {
  const pointString = points
    .map(point => `point=${point[1]},${point[0]}&`)
    .join('');

  const response = await window.fetch(
    `https://graphhopper.com/api/1/route?${pointString}vehicle=foot&debug=true&elevation=true&legs=true&details=street_name&key=${process.env.NEXT_PUBLIC_GRAPH_HOPPER_KEY}&type=json&points_encoded=false`,
  );

  const data = await response.json();

  return {response, data};
};
