import { storiesOf } from '@storybook/react';
import React from 'react';

import Typeahead from 'in-analyze/components/EditTagFilterDialog/Typeahead';
import Root from '../_helpers/Root';

const options = [];
for (let i = 0; i < 10000; i = i + 1) {
  options.push({ value: i, label: `${i}` });
}

storiesOf('Analyse/Typeahead Input', module).add('Default', () => <TypeaheadStory options={options} />);

function TypeaheadStory() {
  return (
    <Root>
      <Typeahead
        options={options}
        resultsToShow={100}
        onChange={e => e.value}
        placeholder="Type to filter the results..."
      />
    </Root>
  );
}
