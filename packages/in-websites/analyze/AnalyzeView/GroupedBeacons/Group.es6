import { get } from 'lodash';
import React from 'react';

import { number, millis } from 'in-services/formatters/number';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import Link from 'in-components/Link';

import locals from './Group.mless';

export default function Group({ item, dotColor, showDot }) {
  return (
    <Tr size="compact">
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

          <Link className={locals.name}>{item.name}</Link>
        </div>
      </Td>

      <Td noWrap>{number.compact(get(item, ['metrics', 'beaconCountAgg', 0, 1]))}</Td>

      <Td noWrap>{formatDateTime(item.earliestTimestamp)}</Td>

      <Td noWrap>
        <span className={locals.metricValue}>
          {millis.fixedCompact(get(item, ['metrics', 'beaconDurationAgg', 0, 1]))}
        </span>
      </Td>
    </Tr>
  );
}

// function getGroupingChange(filters, tagName) {
//   const group = filters.get('group');
//   const currentGroupValue = tagName;
//   const tagFilter = filters.get('tagFilter');
//   const newTagFilter = fromJS(
//     createFilter({
//       name: group.get('name'),
//       secondLevelName: group.get('value'),
//       value: currentGroupValue,
//       operator: operators.EQUALS
//     })
//   );
//
//   return {
//     [groupByMatrixParameter]: {},
//     [tagFilterMatrixParameter]: tagFilter
//       // avoid duplicate addition of same filter
//       .filter(
//         f =>
//           f.get('name') !== newTagFilter.get('name') ||
//           f.get('secondLevelName') !== newTagFilter.get('secondLevelName') ||
//           f.get('value') !== newTagFilter.get('value') ||
//           f.get('operator') !== newTagFilter.get('operator')
//       )
//       .push(newTagFilter)
//       .toJS()
//   };
// }
//
// function trackSetGrouping(filters, tagName) {
//   const group = filters.get('group');
//   const currentGroupValue = tagName;
//   clickGroupTracker({
//     context: 'calls',
//     type: group.get('name'),
//     value: group.get('value'),
//     group: currentGroupValue
//   });
// }
