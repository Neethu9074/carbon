import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import {
  tagFilter as tagFilterMatrixParameter,
  showRawData as showRawDataMatrixParameter
} from 'in-analyze/navigation/matrix';
import { number, millis, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { createFilter } from 'in-analyze/filterBuilder';
import { operators } from 'in-analyze/applicationFilter';
import Button from 'in-new-components/Button';

import locals from './Group.mless';

export default function Group({ item, filters, onChangeFilters, dotColor }) {
  const isAlreadyFiltered = isAlreadyFilteredByThisGroup(item, filters);

  const rowContent = (
    <Fragment>
      <Td className={locals.labelCell}>
        <div className={locals.cell}>
          <span className={locals.dot}>
            {dotColor ? (
              <div className={locals.rect} style={{ background: dotColor }} />
            ) : (
              <span className={locals.rectPlaceHolder} />
            )}
          </span>
          <Fragment>
            <span className={locals.groupLabel} onClick={() => openRawData(filters, onChangeFilters, item.name)}>
              {item.name}
            </span>
            {!isAlreadyFiltered && (
              <Button
                className={locals.filterButton}
                size="compact"
                kind="action"
                icon="lib_actions_filter"
                onClick={() => onSetGrouping(filters, onChangeFilters, item.name, isAlreadyFiltered)}
              >
                Filter by
              </Button>
            )}
          </Fragment>
        </div>
      </Td>

      <Td>{number.compact(get(item, ['metrics', 'calls', 0, 1]))}</Td>

      <Td>{formatDateTime(item.timestamp)}</Td>

      <Td>
        <span className={locals.metricValue}>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</span>
      </Td>

      <Td>{percentageTwoDecimalPlaces(get(item, ['metrics', 'errors', 0, 1]))}</Td>
    </Fragment>
  );

  return <Tr size="compact">{rowContent}</Tr>;
}

function isAlreadyFilteredByThisGroup(item, filters) {
  const currentGroup = filters.getIn(['group', 'name']);

  const tagFilter = filters.get('tagFilter');
  for (let i = 0; i < tagFilter.size; i++) {
    const filter = tagFilter.get(i);
    if (
      filter.get('name') === currentGroup &&
      filter.get('value') === item.name &&
      filter.get('operator') === operators.EQUALS
    ) {
      return true;
    }
  }

  return false;
}

function openRawData(filters, onChangeFilters, tagName) {
  const group = filters.get('group');
  const currentGroupValue = group.get('value') ? `${group.get('value')}=${tagName}` : tagName;

  const newState = {};
  newState[showRawDataMatrixParameter] = { name: group.get('name'), value: currentGroupValue };
  onChangeFilters(newState);
}

function onSetGrouping(filters, onChangeFilters, tagName, isAlreadyFiltered) {
  const group = filters.get('group');
  const currentGroupValue = group.get('value') ? `${group.get('value')}=${tagName}` : tagName;
  const newState = {};

  if (isAlreadyFiltered) {
    onChangeFilters(newState);
    return;
  }

  const tagFilter = filters.get('tagFilter');

  newState[tagFilterMatrixParameter] = tagFilter
    .push(
      fromJS(
        createFilter({
          name: group.get('name'),
          value: currentGroupValue,
          operator: operators.EQUALS
        })
      )
    )
    .toJS();

  onChangeFilters(newState);
}
