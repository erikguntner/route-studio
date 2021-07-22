import React, {useState} from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import {useDebounce} from 'react-use';
import '@reach/combobox/styles.css';

import styled from 'styled-components';

interface Place {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

interface Cache {
  [key: string]: Place[];
}

const cache: Cache = {};
const fetchPlaces = async (query: string): Promise<Place[]> => {
  if (cache[query]) {
    return Promise.resolve(cache[query]);
  }

  const response = await window.fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&limit=5&format=json`,
  );

  const data: Place[] = await response.json();

  if (response.ok) {
    cache[query] = data;
    return data;
  } else {
    return Promise.reject(new Error('there was an error fetching places'));
  }
};

const useLocationMatch = (searchTerm: string): Place[] => {
  const [locations, setLocations] = useState<Place[]>([]);

  useDebounce(
    () => {
      if (searchTerm.trim() !== '') {
        let isFresh = true;

        fetchPlaces(searchTerm)
          .then(data => {
            if (isFresh) setLocations(data);
          })
          .catch(err => console.log(err));

        return () => {
          isFresh = false;
        };
      }
    },
    500,
    [searchTerm],
  );

  return locations;
};

interface Props {
  onSelect: (coords: [number, number]) => void;
}

export const LocationSearch = ({onSelect}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const locations = useLocationMatch(searchTerm);

  const handleChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (item: string) => {
    const location = locations.find(({display_name}) => display_name === item);
    if (location) {
      onSelect([parseFloat(location.lon), parseFloat(location.lat)]);
    }
  };

  return (
    <Wrapper>
      <Box onSelect={handleSelect} aria-label="Locations">
        <Input placeholder="Search" onChange={handleChangeSearchTerm} />
        {locations && (
          <Popover>
            {locations.length > 0 ? (
              <ComboboxList>
                {locations.map(({osm_id, display_name}) => {
                  return <Option key={osm_id} value={display_name} />;
                })}
              </ComboboxList>
            ) : (
              <Empty>No results</Empty>
            )}
          </Popover>
        )}
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 600px;
  height: 100%;
  padding: 8px;
  background-color: ${props => props.theme.colors.gray[100]};
  border-right: 1px solid ${props => props.theme.colors.gray[200]};

  @media screen and (max-width: ${props => props.theme.screens.md}) {
    display: none;
  }
`;

const Box = styled(Combobox)`
  height: 100%;
  font-family: inherit;
  color: ${props => props.theme.colors.gray[800]};
`;

const Input = styled(ComboboxInput)`
  width: 100%;
  height: 100%;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 4px;
  padding: 0 12px;
  color: inherit;

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.outline};
  }
`;

const Popover = styled(ComboboxPopover)`
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 8px;
  color: ${props => props.theme.colors.gray[800]};
`;

const Empty = styled.div`
  width: 100%;
  padding: 12px;
  color: ${props => props.theme.colors.gray[800]};
`;

const Option = styled(ComboboxOption)`
  color: inherit;

  > [data-highlighted] {
    background-color: ${props => props.theme.colors.gray[100]};
  }
`;
