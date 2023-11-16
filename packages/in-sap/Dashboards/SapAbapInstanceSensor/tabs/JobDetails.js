/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-sap:dashboards.jobName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('JOBNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.jobId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('JOBCOUNT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.jobClass'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('JOBCLASS');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('STATUS');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.scheduleStartDate'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('SDLSTRTDT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.scheduleStartTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('SDLSTRTTM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.prdHours'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('PRDHOURS');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.prdMins'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobMetric.get('PRDMINS');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'jobDetails')
    };
  },
  function JobDetails({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const jobMetrics = data.get('raw_payload');
    if (jobMetrics.size === 0) {
      return null;
    }

    const rows = jobMetrics.toArray().map((jobMetric, idx) => {
      return {
        key: String(idx),
        jobMetric
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.jobsInformation')} />}
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="asc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
