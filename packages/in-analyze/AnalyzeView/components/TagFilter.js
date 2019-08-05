import React from 'react';

import FilterOperator from 'in-analyze/AnalyzeView/components/FilterOperator';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { getOperatorLabel } from 'in-analyze/applicationFilter';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TagFilter.mless';

export default function TagFilter({
  tagFilter,
  isFirstOperator,
  filterConnectionOperators,
  onOperatorChanged,
  isLastOperator,
  hasExtraMargin,
  isOnlyFilter
}) {
  let { name, secondLevelName, value, operator } = tagFilter.tag;
  const node = findSubTreeByFullyQualifiedName(name);

  if (secondLevelName) {
    name = `${name}.${secondLevelName}`;
  }

  return (
    <div className={locals.tagFilterWrapper}>
      <div className={locals.tagFilter} onClick={tagFilter.onClick}>
        <SvgIcon className={locals.icon} type={getIconByName(name)} />

        <span className={locals.name}>{name}</span>
        {operator && <span className={locals.operator}>{node ? getOperatorLabel(node.type, operator) : operator}</span>}
        {value && <span className={locals.value}>{value}</span>}
      </div>

      {!isLastOperator &&
        filterConnectionOperators &&
        isFirstOperator && (
          <div className={hasExtraMargin ? locals.firstSpacedOperatorPlaceholder : locals.firstOperatorPlaceholder}>
            <FilterOperator
              operators={filterConnectionOperators}
              selectedOperator={tagFilter.tag.conjunction}
              onOperatorChanged={onOperatorChanged}
            />
          </div>
        )}
      {filterConnectionOperators &&
        !isLastOperator &&
        !isFirstOperator && (
          <div className={hasExtraMargin ? locals.spacedOperatorPlaceholder : locals.operatorPlaceholder}>
            <FilterOperator
              operators={filterConnectionOperators}
              selectedOperator={tagFilter.tag.conjunction}
              onOperatorChanged={onOperatorChanged}
            />
          </div>
        )}
      {isLastOperator && !isOnlyFilter && <div className={locals.lastOperatorPlaceholder} />}
      {isOnlyFilter && <div className={locals.onlyOperatorPlaceholder} />}

      <SvgIcon className={locals.removeIcon} type="lib_openclose_cancel" onClick={tagFilter.onRemove} />
    </div>
  );
}

function getIconByName(type) {
  if (type === 'application.name') {
    return 'lib_application';
  }
  if (type === 'service.name') {
    return 'lib_application_service';
  }
  if (type === 'endpoint.name') {
    return 'lib_application_endpoint';
  }
  return 'lib_views_tag';
}
