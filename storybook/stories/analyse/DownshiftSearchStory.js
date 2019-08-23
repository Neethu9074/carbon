import { storiesOf } from '@storybook/react';
import React from 'react';

import AutocompleteInput from 'in-analyze/components/EditTagFilterDialog/AutocompleteInput';
import Root from '../_helpers/Root';

const options = [];
for (let i = 0; i < 10000; i = i + 1) {
  options.push({ value: i, label: `${i}` });
}

storiesOf('Analyse/Autocomplete Input', module).add('Default', () => <AutocompleteStory options={options} />);

function AutocompleteStory() {
  return (
    <Root>
      <AutocompleteInput options={options} resultsToShow={100} placeholder="Type to filter the results..." />
    </Root>
  );
}
