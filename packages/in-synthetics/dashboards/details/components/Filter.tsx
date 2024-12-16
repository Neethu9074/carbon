/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactChild } from 'react';

import { ButtonGroup, SearchInput } from '@instana/components';
import { t } from '@instana/i18n-react';

import { FilterProps } from 'in-synthetics/utils/constants';
import { isNotBlank } from 'in-services/util/string';

import locals from './Filter.mless';

export default function Filter({ filter, setFilter, isBrowserType }: FilterProps) {
  const buttonPropsList = [
    {
      text: t('in-synthetics:dashboard.detailsPage.typesFilterValues.allType'),
      key: 'ALL',
      onClick: () => setFilter({ query: filter.query, type: 'ALL' }),
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.typesFilterValues.getType'),
      key: 'GET',
      onClick: () => setFilter({ query: filter.query, type: 'GET' }),
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.typesFilterValues.othersType'),
      key: 'OTHERS',
      onClick: () => setFilter({ query: filter.query, type: 'OTHERS' }),
      className: locals.buttonFocus
    }
  ];

  const browserButtonPropsList = [
    {
      text: t('in-synthetics:dashboard.detailsPage.typesFilterValues.allType'),
      key: '',
      onClick: () => {
        setFilter({ query: filter.query, type: '' });
      },
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.document'),
      key: 'document',
      onClick: () => {
        setFilter({ query: filter.query, type: 'document' });
      },
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.stylesheet'),
      key: 'stylesheet',
      onClick: () => {
        setFilter({ query: filter.query, type: 'stylesheet' });
      },
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.image'),
      key: 'image',
      onClick: () => {
        setFilter({ query: filter.query, type: 'image' });
      },
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.font'),
      key: 'font',
      onClick: () => {
        setFilter({ query: filter.query, type: 'font' });
      },
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.script'),
      key: 'script',
      onClick: () => {
        setFilter({ query: filter.query, type: 'script' });
      },
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.media'),
      key: 'media',
      onClick: () => {
        setFilter({ query: filter.query, type: 'media' });
      },
      className: locals.buttonFocus
    },
    {
      text: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.other'),
      key: 'other',
      onClick: () => {
        setFilter({ query: filter.query, type: 'other' });
      },
      className: locals.buttonFocus
    }
  ];

  return (
    <div className={locals.wrapper}>
      <FilterBlock title={t('in-synthetics:dashboard.detailsPage.searchFilter')}>
        <SearchInput
          maxWidth="10rem"
          query={filter.query}
          placeholder={t('in-components:searchInput.placeholderSearch')}
          onChange={query => {
            if (isNotBlank(query)) {
              setFilter({
                query,
                type: filter.type
              });
            } else {
              setFilter({
                query: '',
                type: filter.type
              });
            }
          }}
        />
      </FilterBlock>
      <FilterBlock title={t('in-synthetics:dashboard.detailsPage.typesFilter')}>
        <ButtonGroup
          buttonPropsList={isBrowserType ? browserButtonPropsList : buttonPropsList}
          activeKey={filter.type}
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
