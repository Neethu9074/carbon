import { withState } from 'recompose';
import React from 'react';

import List from 'in-analyze/Analyze/components/QuickFilter/List';
import { containsIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchableList.mless';

export default withState('value', 'setValue', '')(SearchableList);
function SearchableList(props) {
  let { items, value, setValue, renderIcon = renderIconDefault } = props;
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
      {!items && <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning width={36} height={36} />}
      {items && items.length === 0 && <span className={locals.noSuggestionsLabel}>No suggestions found</span>}
      {items && items.length > 0 && <List {...props} renderIcon={renderIcon} items={items} />}
    </div>
  );
}

function renderIconDefault(item) {
  if (!item.icon) {
    return null;
  }
  return <SvgIcon className={locals.entityIcon} type={item.icon} width={24} height={24} />;
}
