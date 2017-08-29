import React from 'react';

import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import { evaluateClassNames } from 'in-services/util/classnames';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { formatDateTime } from 'in-services/formatters/date';
import { focusedMoment$ } from 'in-stores/timeline';
import { compare } from 'in-services/util/boolean';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './Table.less';

const block = 'in-agent-view-table';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshot(row) {
        return row.snapshot;
      }
    }
  },
  {
    title: 'Host',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$(row) {
        return getHostSnapshotId(row.snapshot);
      }
    }
  },
  {
    title: 'Boot Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'boot']);
      }
    }
  },
  {
    title: 'Mode',
    type: 'string',
    typeArgs: {
      getValue(row) {
        switch (row.snapshot.getIn(['data', 'mode'])) {
          case 1:
            return 'Infrastructure';
          case 2:
            return 'Full APM';
          default:
            return 'Off';
        }
      }
    }
  },
  {
    title: 'Java Runtime',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return `${row.snapshot.getIn(['data', 'java', 'vmname'])} ${row.snapshot.getIn(['data', 'java', 'version'])}`;
      }
    }
  },
  {
    title: 'Status',
    type: 'custom',
    typeArgs: {
      comparator: compare,
      get(row) {
        return {
          value: row.isReportingAtFocusedMoment,
          content: (
            <Tooltip content={getTooltipReportingText(row)} align={'rightMiddle'}>
              <Reporting isReporting={row.isReportingAtFocusedMoment} />
            </Tooltip>
          )
        };
      }
    }
  }
];

export default connectTo(
  {
    agents: getSnapshotsInTimeframe('entity.selfType:agent').throttle(200),
    focusedMoment: focusedMoment$
  },
  function AgentViewTable({ agents, focusedMoment }) {
    if (!agents) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = agents.toArray().map(snapshot => {
      return {
        key: snapshot.get('id'),
        snapshot,
        isReportingAtFocusedMoment: isReportingAtFocusedMoment(snapshot, focusedMoment)
      };
    });

    return (
      <div className={block}>
        <Table maxItemsPerPage={20} cols={cols} rows={rows} />
      </div>
    );
  }
);

function Reporting({ isReporting }) {
  return (
    <div
      className={evaluateClassNames({
        [`${block}__reporting`]: true,
        [`${block}__is-reporting`]: isReporting
      })}
    >
      {`${isReporting ? 'reporting' : 'not reporting'}`}
    </div>
  );
}

function getTooltipReportingText(row) {
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

function isReportingAtFocusedMoment(snapshot, focusedMoment) {
  const from = snapshot.get('from');
  const to = snapshot.get('to');

  if (!to && !focusedMoment) {
    return true;
  }
  return from <= focusedMoment && (!to || to >= focusedMoment) ? true : false;
}
