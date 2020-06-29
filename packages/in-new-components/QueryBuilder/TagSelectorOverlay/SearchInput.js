import PropTypes from 'prop-types';
import React from 'react';

import { Li, ColumnizedContent } from 'in-new-components/lists/List/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchInput.mless';

const columnDefinitions = [
  {
    width: '2rem',
    getContent() {
      return <SvgIcon className={locals.icon} type="lib_actions_search" />;
    }
  },
  {
    getContent() {
      return (
        <KeyValue
          value="Search all properties"
          label="Search through all strings to find matches"
          inverted
          accentuated
        />
      );
    }
  }
];

export default function SearchInput({ query, setQuery }) {
  return (
    <Li>
      <ColumnizedContent columnDefinitions={columnDefinitions} query={query} setQuery={setQuery} />
    </Li>
  );
}

SearchInput.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired
};
