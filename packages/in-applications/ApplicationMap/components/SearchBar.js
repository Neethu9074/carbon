/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withState } from 'recompose';
import React from 'react';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import SearchInput from 'in-new-components/SearchInput';

import locals from './SearchBar.mless';

export default withState('value', 'setValue', '')(SearchBar);
function SearchBar({ serviceLocatorUid, value, setValue }) {
  const eventBusServiceLocator = getServiceLocators(serviceLocatorUid).eventBusServiceLocator;

  return (
    <div className={locals.searchbar}>
      <SearchInput
        onChange={value => {
          setValue(value);
          eventBusServiceLocator.emit(SIGNALS.SEARCH, value);
        }}
        query={value}
      />
    </div>
  );
}
