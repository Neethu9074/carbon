/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import { escapeRegExp } from 'lodash';
import classNames from 'classnames';

import { keyCodes, KeyValue, Li, ListGroup, SvgIcon, Ul, SearchInput } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import { compareIgnoreCase } from 'in-services/util/string';
import { capitalize } from 'in-services/formatters/string';
import { t } from 'in-i18n';

import locals from 'in-components/ChartingConfigurator/GroupedMetricSelectorOverlay.mless';

const { isEscape, isReturn } = keyCodes;

export const getProductAreaFromMetricSource = metricSource => {
  switch (metricSource) {
    case 'APPLICATION':
    case 'WEBSITE':
      return metricSource.toLowerCase();
    case 'MOBILE_APP':
      return 'mobileApp';
    case 'INFRASTRUCTURE_METRICS':
      return 'infrastructure';
    default:
      return 'application';
  }
};

function OverlayGroup({ label, className, size, children }) {
  return (
    <ListGroup label={label} className={classNames(locals.group, locals.alignLeft, className)} size={size}>
      {children}
    </ListGroup>
  );
}

function OverlayOption({ autoFocus, className, selectedValue, value, onChange, close, size, children }) {
  return (
    <Li
      className={classNames(locals.option, className, locals.alignLeft)}
      noAlternatingBg
      autoFocus={autoFocus ?? selectedValue === value}
      size={size}
      onClick={() => {
        onChange(value);
        close();
      }}
    >
      {children}
    </Li>
  );
}

export default function GroupedMetricSelectorOverlay({
  options,
  onChange,
  asyncClose,
  dataSource,
  unifiedMetricsSource,
  listItemClassName,
  listItemAlignment
}) {
  const [valueFilter, setValueFilter] = useState('');

  const valueRegex = new RegExp(valueFilter.split('').map(escapeRegExp).join('.*'), 'i');

  const items = options
    .filter(
      group =>
        group.options?.filter(option => valueRegex.test(option.label)).length > 0 ||
        group.options?.filter(option => valueRegex.test(option.description)).length > 0
    )
    .map((group, idx) => {
      return [
        <OverlayGroup key={`group-${idx}`} label={capitalize(group.value)}>
          {group.options
            ?.filter(option => valueRegex.test(option.label) || valueRegex.test(option.description))
            .sort(optionLabelComparator)
            .map((opt, idx) => {
              return (
                <OverlayOption
                  key={`option-${idx}`}
                  className={listItemClassName}
                  alignment={listItemAlignment}
                  onChange={onChange}
                  close={asyncClose}
                  value={opt}
                >
                  <SvgIcon type={getIconByType(dataSource, getProductAreaFromMetricSource(unifiedMetricsSource))} />
                  <KeyValue
                    multilineValue
                    multilineLabel
                    className={locals.optionValueMargin}
                    label={opt.description}
                    value={opt.label}
                    accentuated
                    inverted
                  />
                </OverlayOption>
              );
            })}
        </OverlayGroup>
      ];
    });

  return (
    <>
      <div className={locals.searchWrapper}>
        <SearchInput
          onChange={setValueFilter}
          query={valueFilter}
          inputClassName={locals.search}
          className={locals.searchContainer}
          autoFocus
          placeholder={t('in-components:searchInput.placeholderSearch')}
        />
      </div>
      <Ul className={locals.list} framed={false} borderRadius="medium" onKeyDown={onKeyDown}>
        {items}
      </Ul>
    </>
  );
}

function optionLabelComparator(a, b) {
  return compareIgnoreCase(a.label, b.label);
}

function onKeyDown(e) {
  if (e.defaultPrevented) return;

  // Intercept Enter and Escape to prevent accidental closing of a dialog when used inside a dialog
  if (isReturn(e) || isEscape(e)) return stopPropagationAndPreventDefault(e);

  onArrowKeyDownFocusSiblings(e);
}
