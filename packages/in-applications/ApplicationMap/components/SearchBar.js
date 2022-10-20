/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import SearchInput from 'in-components/SearchInput';

import locals from './SearchBar.mless';

export default function SearchBar({ serviceLocatorUid }) {
  const [value, setValue] = useState('');
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
