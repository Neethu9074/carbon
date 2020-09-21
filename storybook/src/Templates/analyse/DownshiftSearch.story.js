import React from 'react';

import Typeahead from 'in-new-components/Typeahead';

const options = [];
for (let i = 0; i < 10000; i = i + 1) {
  options.push({ value: i, label: `${i}` });
}

export default {
  title: 'Templates|analyze/Typeahead',
  component: Typeahead
};

export function Default() {
  return (
    <Typeahead
      options={options}
      resultsToShow={100}
      onChange={e => e.value}
      placeholder="Type to filter the results..."
    />
  );
}
