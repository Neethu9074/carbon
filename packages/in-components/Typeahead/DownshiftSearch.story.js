/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Typeahead from 'in-components/Typeahead';

export default {
  component: Typeahead
};

export function Default() {
  const options = ['test', '123', 'helloooo'];
  return (
    <Typeahead
      options={options}
      resultsToShow={100}
      onChange={e => e.value}
      placeholder="Type to filter the results..."
    />
  );
}
