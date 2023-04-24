/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import ToggleStatusButtonGroup from 'in-sap/Dashboards/tables/ToggleStatusButtonGroup';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { positiveNumber, number } from 'in-services/formatters/number';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.eventNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.availMainMetric.get('eventNames');
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.availMainMetric.get('status');
      }
    }
  },
  {
    title: t('in-sap:dashboards.value'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.availMainMetric.get('value');
      },
      getContent: positiveNumber
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'metrics.http')
    };
  },
  function HttpAvailability({ data }) {
    const [selectedStatus, setSelectedStatus] = useState(null);

    const { snapshotId, timeConfig } = snapshotMap;
    if (!data) {
      return <NoDataAvailable text={t('in-sap:dashboards.noHttpData')} />;
    }
    const availMainMetrics = data.get('raw_payload', []);
    const rows = availMainMetrics
      .keySeq()
      .toArray()
      .map(key => {
        const availMainMetric = availMainMetrics.get(key);
        const nameOfRow = availMainMetric.get('maxValue');
        return {
          key: String(key),
          nameOfRow,
          snapshotId,
          timeConfig,
          availMainMetric
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <Card title={t('in-sap:dashboards.httpStatus')} useMaxAvailableHeight>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['metrics.http.' + row.key + '.value'],
              labels: [t('in-sap:value')],
              type: 'stackedArea',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Card>
      );
    };
    var filteredRows = filterHttp(selectedStatus, rows);
    return (
      <Card
        title={t('in-sap:dashboards.httpStatus')}
        header={<ToggleStatusButtonGroup selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />}
      >
        <Table
          withoutPadding
          cols={cols}
          rows={filteredRows}
          initialSortColumn={0}
          initialSortDirection="asc"
          getRowDetails={getDetails}
        />
      </Card>
    );
  }
);

function filterHttp(conditions, rows) {
  if (conditions == 1) {
    return rows.filter(function (el) {
      return el.nameOfRow >= 100 && el.nameOfRow < 200;
    });
  } else if (conditions == 2) {
    return rows.filter(function (el) {
      return el.nameOfRow >= 200 && el.nameOfRow < 300;
    });
  } else if (conditions == 3) {
    return rows.filter(function (el) {
      return el.nameOfRow >= 300 && el.nameOfRow < 400;
    });
  } else if (conditions == 4) {
    return rows.filter(function (el) {
      return el.nameOfRow >= 400 && el.nameOfRow < 500;
    });
  } else if (conditions == 5) {
    return rows.filter(function (el) {
      return el.nameOfRow >= 500 && el.nameOfRow < 600;
    });
  } else if (conditions == 6) {
    return rows.filter(function (el) {
      return el.nameOfRow >= 600 || el.nameOfRow < 100;
    });
  } else {
    return rows;
  }
}
