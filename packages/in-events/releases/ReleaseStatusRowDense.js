import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ReleaseStatusRowDense.mless';

export default function ReleaseStatusRowDense({ rawEvent }) {
  return (
    <Tr className={locals.row} size="compact">
      <Td>
        <SvgIcon className={locals.icon} type="lib_release_rocket" />
      </Td>
      <Td>
        <div className={locals.item}>
          <span className={locals.label}>{rawEvent.title}</span>
          <div className={locals.secondRow}>
            <time dateTime={new Date(rawEvent.start).toISOString()}>{formatDateTime(rawEvent.start)}</time>
          </div>
        </div>
      </Td>
    </Tr>
  );
}
