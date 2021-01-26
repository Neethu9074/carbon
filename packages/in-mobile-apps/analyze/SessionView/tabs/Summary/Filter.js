/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo } from 'react';
import { sortedUniqBy } from 'lodash';
import classNames from 'classnames';
import theme from 'in-themes';
import { t } from 'in-i18n';

import { types } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/filterableTypes';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { compareIgnoreCase, isNotBlank } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';
import Select from 'in-components/form/Select';
import Tooltip from 'in-components/Tooltip';

import locals from './Filter.mless';

export default function Filter({ filter, setFilter, beacons }) {
  const views = useMemo(() => getViews(beacons), [beacons]);

  return (
    <div className={locals.wrapper}>
      {views.length > 1 && (
        <FilterBlock title={t('in-mobile-apps:sessionView.tabsSumFilter.viewsTitle')}>
          <Select
            id="view-filter"
            value={filter.view || ''}
            className={locals.viewFilter}
            onChange={e => {
              stopPropagationAndPreventDefault(e);
              if (e.target.value === '') {
                setFilter({
                  ...filter,
                  view: ''
                });
              } else {
                setFilter({
                  ...filter,
                  view: e.target.value
                });
              }
            }}
          >
            <option value="">{t('in-mobile-apps:sessionView.tabsSumFilter.allOption')}</option>
            {views.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </FilterBlock>
      )}

      <FilterBlock title={t('in-mobile-apps:sessionView.tabsSumFilter.searchTitle')}>
        <SearchInput
          maxWidth="10rem"
          query={filter.query}
          onChange={query => {
            if (isNotBlank(query)) {
              setFilter({
                ...filter,
                query
              });
            } else {
              setFilter({
                ...filter,
                query: ''
              });
            }
          }}
        />
      </FilterBlock>

      <FilterBlock title={t('in-mobile-apps:sessionView.tabsSumFilter.typesTitle')}>
        <ul className={locals.typeFilters}>
          <li className={locals.typeFilter}>
            <a
              href=""
              style={{ '--type-color': theme.lib.colors.lightBlue800 }}
              className={classNames({
                [locals.typeFilterLink]: true,
                [locals.active]: filter.types.length === 0
              })}
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                setFilter({
                  ...filter,
                  types: []
                });
              }}
            >
              All
            </a>
          </li>

          {Object.keys(types)
            .filter(k => types[k])
            .map(type => (
              <FilterItem key={type} filter={filter} setFilter={setFilter} type={type} />
            ))}
        </ul>
      </FilterBlock>
    </div>
  );
}

function FilterItem({ filter, setFilter, type }) {
  const isActive = filter.types.indexOf(type) !== -1;
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
              newTypeFilters = filter.types.filter(t => t !== type);
            } else {
              newTypeFilters = filter.types.concat(type);
            }
            setFilter({
              ...filter,
              types: newTypeFilters
            });
          }}
        >
          {types[type].short}
        </a>
      </Tooltip>
    </li>
  );
}

function getViews(beacons) {
  return sortedUniqBy(
    beacons
      .map(b => b.view)
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
