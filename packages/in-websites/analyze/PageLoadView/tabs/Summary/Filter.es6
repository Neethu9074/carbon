import React from 'react';

import { types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';

import locals from './Filter.mless';

export default function Filter({ filter, setFilter }) {
  return (
    <div className={locals.wrapper}>
      {/* left side */}
      <div className={locals.left}>
        <h2 className={locals.header}>Filter</h2>

        <ul className={locals.typeFilters}>
          <li className={locals.typeFilter}>
            <a
              href=""
              style={{ '--type-color': theme.lib.colors.lightBlue800 }}
              className={evaluateClassNames({
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

          {Object.keys(types).map(type => (
            <FilterItem key={type} filter={filter} setFilter={setFilter} type={type} />
          ))}
        </ul>
      </div>
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
          className={evaluateClassNames({
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
