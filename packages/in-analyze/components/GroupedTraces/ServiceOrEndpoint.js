import React from 'react';
import { get } from 'lodash';

import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { Td, Tr } from 'in-components/tables/sharedComponents';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

import locals from './Group.mless';

export function ServiceOrEndpoint({ item, createItemLink }) {
  return (
    <Tr size="compact">
      <Td className={locals.labelCell} ellipsis="50vw">
        <div className={locals.cell}>
          <Link onClick={() => applicationsAlertingEventDetailsGoToAnalyze()} href$={createItemLink(item)}>
            {item.name}
          </Link>
        </div>
      </Td>
      <Td className={locals.labelCell} noWrap>
        {number.compact(get(item, ['metrics', `calls_SUM_Agg`, 0, 1]))}
      </Td>
    </Tr>
  );
}
