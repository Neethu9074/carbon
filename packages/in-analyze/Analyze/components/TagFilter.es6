import React from 'react';

import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { getOperatorLabel } from 'in-analyze/applicationFilter';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes/theme';

import locals from './TagFilter.mless';

export default function TagFilter({
  tagFilter,
  isFirstOperator,
  filterConnectionOperator,
  isLastOperator,
  isOnlyFilter
}) {
  let { name, value, operator } = tagFilter;
  const node = findSubTreeByFullyQualifiedName(name);

  if (node.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    const result = TAG_TYPES.KEY_VALUE_PAIR.splitValue(value);
    if (result.key) {
      name = `${name}.${result.key}`;
    }
    value = result.value;
  }

  return (
    <div className={locals.tagFilterWrapper}>
      <div className={locals.background}>
        <div style={{ width: `${tagFilter.progress * 100}%` }} className={locals.progressBar} />
      </div>

      <div className={locals.tagFilter} onClick={tagFilter.onClick}>
        <SvgIcon className={locals.icon} type={getIconByName(name)} width={24} height={24} />

        <span className={locals.name}>{name}</span>
        {operator && <span className={locals.operator}>{getOperatorLabel(node.type, operator)}</span>}
        {value && <span className={locals.value}>{value}</span>}
      </div>

      {!isLastOperator &&
        filterConnectionOperator &&
        isFirstOperator && (
          <div className={locals.firstOperatorPlaceholder}>
            <Pill className={locals.operator} color={theme.lib.colors.N400}>
              {filterConnectionOperator}
            </Pill>
          </div>
        )}
      {filterConnectionOperator &&
        !isLastOperator &&
        !isFirstOperator && (
          <div className={locals.operatorPlaceholder}>
            <Pill className={locals.operator} color={theme.lib.colors.N400}>
              {filterConnectionOperator}
            </Pill>
          </div>
        )}
      {isLastOperator && !isOnlyFilter && <div className={locals.lastOperatorPlaceholder} />}
      {isOnlyFilter && <div className={locals.onlyOperatorPlaceholder} />}

      <SvgIcon
        className={locals.removeIcon}
        type="lib_openclose_cancel"
        width={24}
        height={24}
        onClick={tagFilter.onRemove}
      />
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
