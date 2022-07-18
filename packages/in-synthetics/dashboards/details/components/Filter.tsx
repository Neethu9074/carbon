/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactChild } from 'react';

import { t } from '@instana/i18n-react';

import SearchInput from 'in-components/SearchInput/SearchInput';
import { FilterProps } from 'in-synthetics/utils/constants';
import { isNotBlank } from 'in-services/util/string';

import locals from './Filter.mless';

export default function Filter({ filter, setFilter }: FilterProps) {
  return (
    <div className={locals.wrapper}>
      <FilterBlock title={t('in-synthetics:dashboard.detailsPage.searchFilter')}>
        <SearchInput
          maxWidth="10rem"
          query={filter.query}
          onChange={query => {
            if (isNotBlank(query)) {
              setFilter({
                query
              });
            } else {
              setFilter({
                query: ''
              });
            }
          }}
        />
      </FilterBlock>
    </div>
  );
}

interface FilterBlockProps {
  children: ReactChild;
  title: string;
}

function FilterBlock({ children, title }: FilterBlockProps) {
  return (
    <div className={locals.filterBlock}>
      <h2 className={locals.header}>{title}</h2>
      {children}
    </div>
  );
}
