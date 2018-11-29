import { get } from 'lodash';
import React from 'react';

import { number, millis } from 'in-services/formatters/number';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import Link from 'in-components/Link';

import locals from './Group.mless';

export default function Group({ item, dotColor, showDot, getGroupAsFilterUrl }) {
  const name = JSON.parse(item.name);
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

          <Link className={locals.name} href$={getGroupAsFilterUrl(name)}>
            {name}
          </Link>
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
