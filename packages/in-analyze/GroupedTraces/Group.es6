import React, { Fragment } from 'react';
import { get } from 'lodash';

import { number, millis, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Group.mless';

export default function Group({ item, dotColor }) {
  return (
    <Fragment>
      <Tr>
        <Td>
          <div className={locals.cell}>
            <span className={locals.dot}>
              {dotColor ? (
                <div className={locals.rect} style={{ background: dotColor }} />
              ) : (
                <span className={locals.rectPlaceHolder} />
              )}
            </span>
            <Link className={locals.link} href$={getLinkToAnalyze({ traceGroupName: item.name, raw: true })}>
              {item.name}
            </Link>
          </div>
        </Td>
        <Td>
          <Counter>{number.compact(get(item, ['metrics', 'calls', 0, 1]))}</Counter>
        </Td>
        <Td>
          <div className={locals.cell}>
            <SvgIcon type="time" width={12} height={12} className={locals.timeIcon} color="#47626A" />
            <span className={locals.duration}>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</span>
          </div>
        </Td>
        <Td>{percentageTwoDecimalPlaces(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
    </Fragment>
  );
}
