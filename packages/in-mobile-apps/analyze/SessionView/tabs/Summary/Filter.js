/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import { sortedUniqBy } from 'lodash';
import classNames from 'classnames';

import { Select, SearchInput } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { types } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/filterableTypes';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { compareIgnoreCase, isNotBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Filter.mless';

export default function Filter({
  view,
  setView,
  query,
  setQuery,
  filterTypes,
  setTypes,
  beacons,
  appState,
  setAppState
}) {
  const views = useMemo(() => getViews(beacons), [beacons]);
  const appStates = useMemo(() => getAppStates(beacons), [beacons]);

  return (
    <div className={locals.wrapper}>
      {views.length > 1 && (
        <FilterBlock title={t('in-mobile-apps:sessionView.tabsSumFilter.viewsTitle')}>
          <Select
            id="view-filter"
            value={view || ''}
            className={locals.viewFilter}
            onChange={e => {
              stopPropagationAndPreventDefault(e);
              if (e.target.value === '') {
                setView('');
              } else {
                setView(e.target.value);
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

      {appStates.length > 1 && (
        <FilterBlock title={t('in-mobile-apps:sessionView.tabsSumFilter.appStateTitle')}>
          <Select
            id="app-state-filter"
            value={appState || ''}
            className={locals.viewFilter}
            onChange={e => {
              stopPropagationAndPreventDefault(e);
              setAppState(e.target.value || '');
            }}
          >
            <option value="">{t('in-mobile-apps:sessionView.tabsSumFilter.allOption')}</option>
            {appStates.map(v => (
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
          query={query}
          onChange={query => {
            if (isNotBlank(query)) {
              setQuery(query);
            } else {
              setQuery('');
            }
          }}
          placeholder={t('in-components:searchInput.placeholderSearch')}
        />
      </FilterBlock>

      <FilterBlock title={t('in-mobile-apps:sessionView.tabsSumFilter.typesTitle')}>
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
                setTypes([]);
              }}
            >
              All
            </a>
          </li>

          {Object.keys(types)
            .filter(k => k != 'default' && types[k])
            .map(type => (
              <FilterItem key={type} filterTypes={filterTypes} setTypes={setTypes} type={type} />
            ))}
        </ul>
      </FilterBlock>
    </div>
  );
}

function FilterItem({ filterTypes, setTypes, type }) {
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
            setTypes(newTypeFilters);
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

function getAppStates(beacons) {
  return sortedUniqBy(
    beacons
      .map(b => b.currentAppState)
      .filter(isNotBlank)
      .sort(compareIgnoreCase),
    s => s.toLowerCase()
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
