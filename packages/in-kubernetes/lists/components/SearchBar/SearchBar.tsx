/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonSearch } from '@instana/components';

import { t } from 'in-i18n';

import locals from './SearchBar.mless';

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className={locals.searchBar}>
      <CarbonSearch
        value={query}
        labelText=""
        placeholder={t('in-kubernetes:cloudNative.search')}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
