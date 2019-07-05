import React, { Fragment } from 'react';
import { get } from 'lodash';

import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import MetricColumnCells from 'in-analyze/components/MetricColumn/MetricColumnCells';
import SnapshotEntityLink from 'in-analyze/components/GroupedTraces/SnapshotEntityLink';
import { evaluateClassNames } from 'in-services/util/classnames';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { groupClickedTracker } from 'in-analyze/tracker';
import { operators } from 'in-analyze/applicationFilter';
import { createFilter } from 'in-analyze/filterBuilder';
import { number } from 'in-services/formatters/number';
import { isInstanaEngineer } from 'in-stores/user';
import { isBlank } from 'in-services/util/string';
import { getTagType } from 'in-applications/tags';
import Link from 'in-components/Link';

import locals from './Group.mless';

const NO_VALUE = 'no_value';
const NO_VALUE_LABEL = 'No Value';

export default function Group({
  dataSource,
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
            className={evaluateClassNames({
              [locals.name]: true,
              [locals.specialName]: isSpecialItem(item)
            })}
          >
            {getItemLabel(item)}
          </Link>

          {// internal feature: link to infrastructure entity when group value is a snapshot id
          isInstanaEngineer && (
            <div className={locals.snapshotEntityLink}>
              <SnapshotEntityLink
                snapshotId={filters.group.name.indexOf('snapshotId') > 0 ? item.name : null}
                time={item.timestamp}
              />
            </div>
          )}
        </div>
      </Td>

      <Td noWrap>{number.compact(get(item, ['metrics', `${dataSource}_SUM_Agg`, 0, 1]))}</Td>

      <Td noWrap>{formatDateTime(item.timestamp)}</Td>

      <MetricColumnCells item={item} metrics={metrics} availableMetrics={availableMetrics} />
    </Fragment>
  );

  return <Tr size="compact">{rowContent}</Tr>;
}

function isSpecialItem(item) {
  return item.name === NO_VALUE;
}

function getItemLabel(item) {
  if (item.name === NO_VALUE) {
    return NO_VALUE_LABEL;
  } else {
    return item.name;
  }
}

function getGroupingChange(filters, selectedGroupValue) {
  const group = filters.group;
  const tagName = group.name;
  const secondLevelKey = group.value;
  const tagFilter = filters.tagFilter;

  // if the second level key of a key value pair tag is empty
  // set the selected group as second level key and update the grouping tag
  if (getTagType(tagName) === 'KEY_VALUE_PAIR' && isBlank(secondLevelKey)) {
    return {
      [groupByMatrixParameter]: {
        name: tagName,
        value: selectedGroupValue
      },
      [tagFilterMatrixParameter]: tagFilter
    };
  } else {
    // for other cases, add a tag filter with the selected group value
    let newTagFilter;
    if (selectedGroupValue === NO_VALUE && !isBlank(group.value)) {
      newTagFilter = createFilter({
        name: group.name,
        secondLevelName: group.value,
        operator: operators.IS_BLANK
      });
    } else {
      newTagFilter = createFilter({
        name: group.name,
        secondLevelName: group.value,
        value: selectedGroupValue,
        operator: operators.EQUALS
      });
    }
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
}

function trackSetGrouping(filters, selectedGroupValue) {
  const group = filters.group;

  groupClickedTracker({
    context: filters.dataSource,
    type: group.name,
    value: group.value,
    group: selectedGroupValue
  });
}
