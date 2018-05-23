import React, { Fragment } from 'react';
import { get } from 'lodash';

import { number, millis, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';

import locals from './Group.mless';

export default function Group({ item, dotColor }) {
  return (
    <Fragment>
      <Tr size="compact">
        <Td>
          <div className={locals.cell}>
            <span className={locals.dot}>
              {dotColor ? (
                <div className={locals.rect} style={{ background: dotColor }} />
              ) : (
                <span className={locals.rectPlaceHolder} />
              )}
            </span>
            <Link href$={getLinkToAnalyze({ traceGroupName: item.name, raw: true })}>{item.name}</Link>
          </div>
        </Td>
        <Td>
          <span className={locals.metricValue}>{number.compact(get(item, ['metrics', 'calls', 0, 1]))}</span>
        </Td>
        <Td>
          <span className={locals.metricValue}>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</span>
        </Td>
        <Td>{percentageTwoDecimalPlaces(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
    </Fragment>
  );
}
