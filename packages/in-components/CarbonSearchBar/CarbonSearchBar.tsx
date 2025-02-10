/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useRef } from 'react';

import { CarbonSearch } from '@instana/components';

import { t } from 'in-i18n';

import locals from './CarbonSearchBar.mless';

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
  autoFocus: boolean;
  labelText?: string;
}

export default function SearchBar({ query, onChange, autoFocus, labelText = '' }: Readonly<SearchBarProps>) {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && searchRef?.current) {
      searchRef?.current?.querySelector('input')?.focus();
    }
  }, [autoFocus]);

  return (
    <div className={locals.carbonSearchBar} ref={searchRef}>
      <CarbonSearch
        value={query}
        labelText={labelText}
        placeholder={t('in-components:carbonSearchBar.search')}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
