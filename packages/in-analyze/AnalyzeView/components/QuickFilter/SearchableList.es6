import { withState } from 'recompose';
import React from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import List from 'in-analyze/AnalyzeView/components/QuickFilter/List';
import { containsIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';

import locals from './SearchableList.mless';

export default withState('value', 'setValue', '')(SearchableList);
function SearchableList(props) {
  let { items, error, loading, value, setValue, renderIcon } = props;
  if (items) {
    items = items.filter(suggestion => containsIgnoreCase(suggestion.label, value));
  }

  return (
    <div className={locals.wrapper}>
      <div className={locals.searchRow}>
        <SearchInput
          wrapperClassName={locals.searchInputWrapper}
          inputClassName={locals.searchInput}
          onChange={setValue}
          query={value}
        />
      </div>
      {loading && (
        <HorizontalIndicator
          progress={{
            loading: true
          }}
        />
      )}
      {error && <NoDataAvailable text="Suggestions not available" />}
      {!error && !loading && items && items.length === 0 && <NoDataAvailable text="No suggestions found" />}
      {items && items.length > 0 && <List {...props} renderIcon={renderIcon} items={items} />}
    </div>
  );
}
