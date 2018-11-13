import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import { number, millis, percentage } from 'in-services/formatters/number';
import { clickGroupTracker } from 'in-analyze/components/tracker';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { operators } from 'in-analyze/applicationFilter';
import { createFilter } from 'in-analyze/filterBuilder';
import Link from 'in-components/Link';

import locals from './Group.mless';

export default function Group({ item, filters, onChangeAnalyzeConfigAndGetAsUrlObservable, dotColor, showDot }) {
  const errorMetric = get(item, ['metrics', 'errorsAgg', 0, 1]);
  const rowContent = (
    <Fragment>
      <Td className={locals.labelCell} ellipsis="50vw">
        <div className={locals.cell}>
          {showDot && (
            <span className={locals.dot}>
              {dotColor ? (
                <div className={locals.rect} style={{ background: dotColor }} />
              ) : (
                <span className={locals.rectPlaceHolder} />
              )}
            </span>
          )}
          <Link
            href$={onChangeAnalyzeConfigAndGetAsUrlObservable(getGroupingChange(filters, item.name))}
            onClick={() => trackSetGrouping(filters, item.name)}
            className={locals.name}
          >
            {item.name}
          </Link>
        </div>
      </Td>

      <Td noWrap>{number.compact(get(item, ['metrics', 'tracesAgg', 0, 1]))}</Td>

      <Td noWrap>{formatDateTime(item.timestamp)}</Td>

      <Td noWrap>
        <span className={locals.metricValue}>{millis.fixedCompact(get(item, ['metrics', 'latencyAgg', 0, 1]))}</span>
      </Td>

      <Td noWrap>{errorMetric == 0 ? percentage.compact(errorMetric) : percentage.detailed(errorMetric)}</Td>
    </Fragment>
  );

  return <Tr size="compact">{rowContent}</Tr>;
}

function getGroupingChange(filters, tagName) {
  const group = filters.get('group');
  const currentGroupValue = tagName;
  const tagFilter = filters.get('tagFilter');
  const newTagFilter = fromJS(
    createFilter({
      name: group.get('name'),
      secondLevelName: group.get('value'),
      value: currentGroupValue,
      operator: operators.EQUALS
    })
  );
  return {
    [groupByMatrixParameter]: {},
    [tagFilterMatrixParameter]: tagFilter
      // avoid duplicate addition of same filter
      .filter(
        f =>
          f.get('name') !== newTagFilter.get('name') ||
          f.get('secondLevelName') !== newTagFilter.get('secondLevelName') ||
          f.get('value') !== newTagFilter.get('value') ||
          f.get('operator') !== newTagFilter.get('operator')
      )
      .push(newTagFilter)
      .toJS()
  };
}

function trackSetGrouping(filters, tagName) {
  const group = filters.get('group');
  const currentGroupValue = tagName;
  clickGroupTracker({
    context: 'traces',
    type: group.get('name'),
    value: group.get('value'),
    group: currentGroupValue
  });
}
