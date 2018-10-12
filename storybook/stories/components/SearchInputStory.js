import { storiesOf } from '@storybook/react';
import { withState } from 'recompose';
import React from 'react';

import SearchInput from 'in-new-components/SearchInput';

import Root from '../_helpers/Root';

storiesOf('Components/SearchInput', module).add('Search Input', () => <SearchInputStory />);

function SearchInputStory() {
  return (
    <Root>
      <StatefullSearchInput />
    </Root>
  );
}

const StatefullSearchInput = withState('value', 'setValue', '')(SearchBar);
function SearchBar({ value, setValue }) {
  return <SearchInput onChange={setValue} query={value} maxWidth={200} />;
}
