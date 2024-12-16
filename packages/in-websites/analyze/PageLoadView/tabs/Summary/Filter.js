/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import { sortedUniqBy } from 'lodash';
import classNames from 'classnames';

import { Select, SearchInput } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { compareIgnoreCase, isNotBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Filter.mless';

export default function Filter({ query, setQuery, page, setPage, filterTypes, setFilterTypes, beacons }) {
  const pages = useMemo(() => getPages(beacons), [beacons]);

  return (
    <div className={locals.wrapper}>
      {pages.length > 1 && (
        <FilterBlock title={t('in-websites:analyze.analyzeView.pageLoadView.filterTitlePages')}>
          <Select
            id="page-filter"
            value={page || ''}
            className={locals.pageFilter}
            onChange={e => {
              stopPropagationAndPreventDefault(e);
              if (e.target.value === '') {
                setPage('');
              } else {
                setPage(e.target.value);
              }
            }}
          >
            <option value="">{t('in-websites:analyze.analyzeView.pageLoadView.filterOptionAll')}</option>
            {pages.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FilterBlock>
      )}

      <FilterBlock title={t('in-websites:analyze.analyzeView.pageLoadView.filterTitleSearch')}>
        <SearchInput
          maxWidth="10rem"
          query={query}
          placeholder={t('in-components:searchInput.placeholderSearch')}
          onChange={query => {
            if (isNotBlank(query)) {
              setQuery(query);
            } else {
              setQuery('');
            }
          }}
        />
      </FilterBlock>

      <FilterBlock title={t('in-websites:analyze.analyzeView.pageLoadView.filterTitleTypes')}>
        <ul className={locals.typeFilters}>
          <li className={locals.typeFilter}>
            <a
              href=""
              style={{ '--type-color': themes.default.ids.color.option.blue['400'] }}
              className={classNames({
                [locals.typeFilterLink]: true,
                [locals.active]: filterTypes.length === 0
              })}
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                setFilterTypes([]);
              }}
            >
              {t('in-websites:analyze.analyzeView.pageLoadView.filterOptionAll')}
            </a>
          </li>

          {Object.keys(types)
            .filter(k => types[k])
            .map(type => (
              <FilterItem key={type} filterTypes={filterTypes} setFilterTypes={setFilterTypes} type={type} />
            ))}
        </ul>
      </FilterBlock>
    </div>
  );
}

function FilterItem({ filterTypes, setFilterTypes, type }) {
  const isActive = filterTypes.indexOf(type) !== -1;
  return (
    <li key={type} className={locals.typeFilter}>
      <Tooltip content={types[type].long} align="bottomMiddle">
        <a
          href=""
          style={{ '--type-color': types[type].color }}
          className={classNames({
            [locals.typeFilterLink]: true,
            [locals.active]: isActive
          })}
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            let newTypeFilters;
            if (isActive) {
              newTypeFilters = filterTypes.filter(t => t !== type);
            } else {
              newTypeFilters = filterTypes.concat(type);
            }
            setFilterTypes(newTypeFilters);
          }}
        >
          {types[type].short}
        </a>
      </Tooltip>
    </li>
  );
}

function getPages(beacons) {
  return sortedUniqBy(
    beacons
      .map(b => b.page)
      .filter(isNotBlank)
      .sort(compareIgnoreCase),
    p => p.toLowerCase()
  );
}

function FilterBlock({ children, title }) {
  return (
    <div className={locals.filterBlock}>
      <h2 className={locals.header}>{title}</h2>
      {children}
    </div>
  );
}
