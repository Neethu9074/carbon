import { compose, withPropsOnChange } from 'recompose';
import { defaults, debounce } from 'lodash';
import React from 'react';

import withPropDependingState from 'in-hoc/withPropDependingState';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchInput.mless';

export default compose(
  withPropsOnChange(['onChange'], ({ onChange }) => ({
    onChange: debounce(onChange, 500)
  })),
  withPropDependingState(
    ['query'],
    ({ query }) => ({
      queryInternal: query
    }),
    'setQuery',
    (prevState, newQuery) => defaults({}, { queryInternal: newQuery }, prevState)
  )
)(SearchInput);

function SearchInput({ setQuery, onChange, queryInternal }) {
  return (
    <div className={locals.wrapper}>
      <SvgIcon className={locals.icon} type="search" width={14} height={14} color="#698189" />
      <input
        className={locals.searchInput}
        type="search"
        placeholder="Search…"
        value={queryInternal}
        onChange={e => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
