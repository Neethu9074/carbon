import React, { Fragment } from 'react';
import { get } from 'lodash';

import { number, millis, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Dot from 'in-new-components/Dot';

import locals from './Group.mless';

const DOT_PLACEHOLDER = <span className={locals.dotPlaceHolder} />;

export default function Group({ item, dotColor }) {
  return (
    <Fragment>
      <Tr>
        <Td>
          <Link href$={getLinkToAnalyze({ traceGroupName: item.name, raw: true })}>
            <span className={locals.dot}>{dotColor ? <Dot color={dotColor} /> : DOT_PLACEHOLDER}</span>
            {item.name}
          </Link>
        </Td>
        <Td>{number.compact(get(item, ['metrics', 'calls', 0, 1]))}</Td>
        <Td>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</Td>
        <Td>{percentageTwoDecimalPlaces(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
    </Fragment>
  );
}
