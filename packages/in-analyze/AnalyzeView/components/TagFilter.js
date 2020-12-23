import classNames from 'classnames';
import React from 'react';

import FilterOperator from 'in-analyze/AnalyzeView/components/FilterOperator';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import EntityIndicator from 'in-analyze/components/EntityIndicator';
import { getOperatorLabel } from 'in-analyze/applicationFilter';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TagFilter.mless';

export default function TagFilter({
  tagFilter,
  filterConnectionOperators,
  onOperatorChanged,
  isFirstOperator,
  isLastOperator,
  isOnlyFilter,
  allSameFilters,
  index,
  tagFiltersToPresent,
  readonly
}) {
  let { name, secondLevelName, value, operator, entity } = tagFilter.tag;
  const node = findSubTreeByFullyQualifiedName(name);

  if (secondLevelName) {
    name = `${name}.${secondLevelName}`;
  }

  const isOrOperator = tagFilter.tag.conjunction === 'OR';
  const followsOrOperator = tagFiltersToPresent[index - 1]?.tag.conjunction === 'OR';

  return (
    <div className={locals.tagFilterWrapper}>
      <div
        className={classNames({
          [locals.tagFilter]: true,
          [locals.readonly]: readonly
        })}
        onClick={tagFilter.onClick}
      >
        <EntityIndicator type={name} groupedByEntity={entity} />
        <span className={locals.name}>{name}</span>
        {operator && <span className={locals.operator}>{node ? getOperatorLabel(node.type, operator) : operator}</span>}
        {value != null && <span className={locals.value}>{`${value}`}</span>}
      </div>

      {!isLastOperator && filterConnectionOperators && isFirstOperator && (
        <div className={locals.firstOperatorPlaceholder}>
          <FilterOperator
            operators={filterConnectionOperators}
            selectedOperator={tagFilter.tag.conjunction}
            onOperatorChanged={readonly ? () => {} : onOperatorChanged}
          />
        </div>
      )}

      {filterConnectionOperators && !isLastOperator && !isFirstOperator && (
        <div className={locals.operatorPlaceholder}>
          <FilterOperator
            operators={filterConnectionOperators}
            selectedOperator={tagFilter.tag.conjunction}
            onOperatorChanged={readonly ? () => {} : onOperatorChanged}
          />
        </div>
      )}

      {isLastOperator && !isOnlyFilter && <div className={locals.lastOperatorPlaceholder} />}

      {isOnlyFilter && <div className={locals.onlyOperatorPlaceholder} />}

      {!readonly && (
        <SvgIcon
          className={classNames({
            [locals.removeIcon]: true,
            [locals.iconExtraMargin]:
              tagFiltersToPresent.length > 2 && !allSameFilters && (isOrOperator || followsOrOperator)
          })}
          type="lib_openclose_cancel"
          onClick={tagFilter.onRemove}
        />
      )}
    </div>
  );
}
