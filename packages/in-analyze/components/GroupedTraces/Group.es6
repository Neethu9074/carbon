import React, { Fragment } from 'react';
import { get } from 'lodash';

import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import MetricColumnCells from 'in-analyze/components/MetricColumn/MetricColumnCells';
import { clickGroupTracker } from 'in-analyze/components/tracker';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { operators } from 'in-analyze/applicationFilter';
import { createFilter } from 'in-analyze/filterBuilder';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

import locals from './Group.mless';

export default function Group({
  item,
  filters,
  onChangeAnalyzeConfigAndGetAsUrlObservable,
  dotColor,
  showDot,
  metrics,
  availableMetrics
}) {
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

      <Td noWrap>{number.compact(get(item, ['metrics', 'traces_SUM_Agg', 0, 1]))}</Td>

      <Td noWrap>{formatDateTime(item.timestamp)}</Td>

      <MetricColumnCells item={item} metrics={metrics} availableMetrics={availableMetrics} />
    </Fragment>
  );

  return <Tr size="compact">{rowContent}</Tr>;
}

function getGroupingChange(filters, tagName) {
  const group = filters.group;
  const currentGroupValue = tagName;
  const tagFilter = filters.tagFilter;
  const newTagFilter = createFilter({
    name: group.name,
    secondLevelName: group.value,
    value: currentGroupValue,
    operator: operators.EQUALS
  });
  return {
    [groupByMatrixParameter]: {},
    [tagFilterMatrixParameter]: tagFilter
      // avoid duplicate addition of same filter
      .filter(
        f =>
          f.name !== newTagFilter.name ||
          f.secondLevelName !== newTagFilter.secondLevelName ||
          f.value !== newTagFilter.value ||
          f.operator !== newTagFilter.operator
      )
      .concat(newTagFilter)
  };
}

function trackSetGrouping(filters, tagName) {
  const group = filters.group;
  const currentGroupValue = tagName;
  clickGroupTracker({
    context: 'traces',
    type: group.name,
    value: group.value,
    group: currentGroupValue
  });
}
