import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import {
  tagFilter as tagFilterMatrixParameter,
  showRawData as showRawDataMatrixParameter
} from 'in-analyze/navigation/matrix';
import { analyzeRaw, analyze, cleanupSortingMatrixParams } from 'in-analyze/navigation/paths';
import { number, millis, percentage } from 'in-services/formatters/number';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getShowRawToUrlString } from 'in-analyze/filterBuilder';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { operators } from 'in-analyze/applicationFilter';
import { createFilter } from 'in-analyze/filterBuilder';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';

import locals from './Group.mless';

export default function Group({ item, filters, onChangeFilters, dotColor }) {
  const isAlreadyFiltered = isAlreadyFilteredByThisGroup(item, filters);
  const errorMetric = get(item, ['metrics', 'errorsAgg', 0, 1]);

  const rowContent = (
    <Fragment>
      <Td className={locals.labelCell} ellipsis="50vw">
        <div className={locals.cell}>
          <span className={locals.dot}>
            {dotColor ? (
              <div className={locals.rect} style={{ background: dotColor }} />
            ) : (
              <span className={locals.rectPlaceHolder} />
            )}
          </span>
          <Fragment>
            <Link href$={getLinkToRawData(filters, item)} className={locals.name}>
              {item.name}
            </Link>
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

      <Td noWrap>{number.compact(get(item, ['metrics', 'callsAgg', 0, 1]))}</Td>

      <Td noWrap>{formatDateTime(item.timestamp)}</Td>

      <Td noWrap>
        <span className={locals.metricValue}>{millis.fixedCompact(get(item, ['metrics', 'latencyAgg', 0, 1]))}</span>
      </Td>

      <Td noWrap>{errorMetric == 0 ? percentage.compact(errorMetric) : percentage.detailed(errorMetric)}</Td>
    </Fragment>
  );

  return <Tr size="compact">{rowContent}</Tr>;
}

function getLinkToRawData(filters, item) {
  return getModifiedUrlStream(params => {
    const group = filters.get('group');
    const currentGroupValue = group.get('value') ? `${group.get('value')}=${item.name}` : item.name;

    params.pathname = analyzeRaw;
    setOrDeleteMatrixKey(params, analyze, 'calls.orderBy', null);
    setOrDeleteMatrixKey(
      params,
      analyze,
      showRawDataMatrixParameter,
      getShowRawToUrlString({
        name: group.get('name'),
        value: currentGroupValue
      })
    );

    cleanupSortingMatrixParams(params);
  });
}

function onSetGrouping(filters, onChangeFilters, tagName) {
  const group = filters.get('group');
  const currentGroupValue = tagName;
  const newState = {};

  const tagFilter = filters.get('tagFilter');

  newState[tagFilterMatrixParameter] = tagFilter
    .push(
      fromJS(
        createFilter({
          name: group.get('name'),
          secondLevelName: group.get('value'),
          value: currentGroupValue,
          operator: operators.EQUALS
        })
      )
    )
    .toJS();

  onChangeFilters(newState);
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
