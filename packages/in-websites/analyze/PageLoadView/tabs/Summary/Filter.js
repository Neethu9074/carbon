/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo } from 'react';
import { sortedUniqBy } from 'lodash';
import classNames from 'classnames';

import { types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { compareIgnoreCase, isNotBlank } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';
import Select from 'in-components/form/Select';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';

import locals from './Filter.mless';

export default function Filter({ filter, setFilter, beacons }) {
  const pages = useMemo(() => getPages(beacons), [beacons]);

  return (
    <div className={locals.wrapper}>
      {pages.length > 1 && (
        <FilterBlock title="Pages">
          <Select
            id="page-filter"
            value={filter.page || ''}
            className={locals.pageFilter}
            onChange={e => {
              stopPropagationAndPreventDefault(e);
              if (e.target.value === '') {
                setFilter({
                  ...filter,
                  page: ''
                });
              } else {
                setFilter({
                  ...filter,
                  page: e.target.value
                });
              }
            }}
          >
            <option value="">All</option>
            {pages.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FilterBlock>
      )}

      <FilterBlock title="Search">
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

      <FilterBlock title="Types">
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
