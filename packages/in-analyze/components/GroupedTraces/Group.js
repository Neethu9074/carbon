import React, { Fragment } from 'react';
import { get } from 'lodash';

import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import SnapshotEntityLink from 'in-analyze/components/GroupedTraces/SnapshotEntityLink';
import MetricColumnCells from 'in-analyze/components/MetricColumn/MetricColumnCells';
import classNames from 'classnames';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { formatDateTime } from 'in-services/formatters/date';
import { groupClickedTracker } from 'in-analyze/tracker';
import { operators } from 'in-analyze/applicationFilter';
import { createFilter } from 'in-analyze/filterBuilder';
import { number } from 'in-services/formatters/number';
import { getTagType } from 'in-applications/tags';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Group.mless';

export const NO_VALUE = 'no_value';
export const NO_VALUE_LABEL = 'Tag has no value';
export const UNSPECIFIED = 'Unspecified';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function Group({
    dataSource,
    item,
    filters,
    onChangeAnalyzeConfigAndGetAsUrl,
    dotColor,
    showDot,
    metrics,
    availableMetrics,
    isInternalVisible
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
              href={onChangeAnalyzeConfigAndGetAsUrl(getGroupingChange(filters, item.name))}
              onClick={() => trackSetGrouping(filters, item.name)}
              className={classNames({
                [locals.name]: true,
                [locals.specialName]: isSpecialItem(item)
              })}
            >
              {getItemLabel(item.name, filters.group.name, filters.group.value)}
            </Link>

            {// internal feature: link to infrastructure entity when group value is a snapshot id
            isInternalVisible && (
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
);

function isSpecialItem(item) {
  return item.name === NO_VALUE || item.name === UNSPECIFIED;
}

function getItemLabel(itemName, filtersGroupName, filtersGroupValue) {
  if (itemName === NO_VALUE) {
    return NO_VALUE_LABEL;
  } else if (itemName === UNSPECIFIED) {
    return `Calls without the '${filtersGroupName}${isNotBlank(filtersGroupValue) ? '.' + filtersGroupValue : ''}' tag`;
  } else {
    return itemName;
  }
}

function isServiceOrApplication(tagName) {
  return tagName === 'service.name' || tagName === 'trace.service.name' || tagName === 'application.name';
}

function getGroupingChange(filters, selectedGroupValue) {
  const group = filters.group;
  const tagName = group.name;
  const secondLevelKey = group.value;
  const tagFilter = filters.tagFilter;
  const entity = group.entity;

  // if the second level key of a key value pair tag is empty
  // set the selected group as second level key and update the grouping tag
  let newTagFilter;

  if (getTagType(tagName) === 'KEY_VALUE_PAIR') {
    if (selectedGroupValue === UNSPECIFIED) {
      newTagFilter = createFilter({
        name: tagName,
        secondLevelName: secondLevelKey,
        operator: operators.IS_EMPTY,
        entity: entity
      });
    } else if (selectedGroupValue === NO_VALUE) {
      newTagFilter = createFilter({
        name: tagName,
        secondLevelName: secondLevelKey,
        operator: operators.IS_BLANK,
        entity: entity
      });
    } else {
      if (isBlank(secondLevelKey)) {
        return {
          [groupByMatrixParameter]: {
            name: tagName,
            value: selectedGroupValue,
            entity: entity
          },
          [tagFilterMatrixParameter]: tagFilter
        };
      } else {
        newTagFilter = createFilter({
          name: tagName,
          secondLevelName: secondLevelKey,
          value: selectedGroupValue,
          operator: operators.EQUALS,
          entity: entity
        });
      }
    }
  } else {
    // for other cases, add a tag filter with the selected group value
    if (selectedGroupValue === UNSPECIFIED) {
      newTagFilter = createFilter({
        name: tagName,
        secondLevelName: secondLevelKey,
        value: isServiceOrApplication(tagName) ? selectedGroupValue : '',
        operator: isServiceOrApplication(tagName) ? operators.EQUALS : operators.IS_EMPTY,
        entity: entity
      });
    } else {
      newTagFilter = createFilter({
        name: tagName,
        secondLevelName: secondLevelKey,
        value: selectedGroupValue,
        operator: operators.EQUALS,
        entity: entity
      });
    }
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
          f.operator !== newTagFilter.operator ||
          f.entity !== newTagFilter.entity
      )
      .concat(newTagFilter)
  };
}

function trackSetGrouping(filters, selectedGroupValue) {
  const group = filters.group;

  groupClickedTracker({
    context: filters.dataSource,
    type: group.name,
    value: group.value,
    group: selectedGroupValue,
    entity: group.enity
  });
}
