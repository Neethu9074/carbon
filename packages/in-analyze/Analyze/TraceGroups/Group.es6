import React, { Fragment } from 'react';
import { get } from 'lodash';

import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { number, millis } from 'in-services/formatters/number';
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
        <Td>{number.compact(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
    </Fragment>
  );
}
