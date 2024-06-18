/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SearchInput } from '@instana/components';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { t } from 'in-i18n';

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
        placeholder={t('in-components:searchInput.placeholderSearch')}
      />
    </div>
  );
}
