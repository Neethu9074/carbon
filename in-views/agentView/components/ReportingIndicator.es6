import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { formatDateTime } from 'in-services/formatters/date';
import Tooltip from 'in-components/Tooltip';

import './ReportingIndicator.less';

const block = 'in-in-agent-view-table-reporting-indicator';

export default function ReportingIndicator({ row }) {
  const isReporting = row.isReportingAtFocusedMoment;
  return (
    <Tooltip content={getTooltipText(row)} align={'rightMiddle'}>
      <div
        className={evaluateClassNames({
          [`${block}`]: true,
          [`${block}__is-reporting`]: isReporting
        })}
      >
        {`${isReporting ? 'reporting' : 'not reporting'}`}
      </div>
    </Tooltip>
  );
}

function getTooltipText(row) {
  let text = row.isReportingAtFocusedMoment
    ? ''
    : 'The agent reported in the selected time range but has not reported at the selected moment. ';
  if (!row.snapshot.get('to')) {
    text += `The agent started at ${formatDateTime(row.snapshot.get('from'))} and is still reporting.`;
  } else {
    text += `The agent reported between: ${formatDateTime(row.snapshot.get('from'))} and ${formatDateTime(
      row.snapshot.get('to')
    )}.`;
  }
  return text;
}
