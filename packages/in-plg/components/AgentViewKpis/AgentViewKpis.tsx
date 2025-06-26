/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MeterChart } from '@carbon/charts-react';
import React from 'react';

import { Card, Typography } from '@instana/components';
import { Stack } from '@instana/carbon';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import { emptyList } from 'in-services/fixedImmutables';
import { t, Trans } from 'in-i18n';

interface AgentViewKpis {
  heading: string;
  subHeading: string;
  keyword: string;
  agentSnapshotsResult: OUT | null | undefined;
}

const AgentViewKpis = ({ agentSnapshotsResult, heading, subHeading }: any) => {
  if (!agentSnapshotsResult || agentSnapshotsResult.getIn(['progress', 'loading'])) {
    return <LoadingIndicator />;
  }
  if (agentSnapshotsResult.getIn(['errors']).length > 0) {
    return (
      <ErroneousResultPresenter
        errors={[{ message: t('in-infrastructure:agentView.anErrorOccurredPleaseTryAgain'), code: 'NOT_FOUND' }]}
      />
    );
  }
  const agentSnapshots = agentSnapshotsResult.getIn(['data']);
  const reporting = agentSnapshots?.get('online', emptyList).size;
  const notreporting = agentSnapshots?.get('offline', emptyList).size || 0;
  const group1 = t('in-plg:agentViewKpis.reporting');
  const group2 = t('in-plg:agentViewKpis.notReporting');

  return (
    <Card title={heading} useMaxAvailableHeight={false} hasMarginBottom>
      <Stack gap="0.85rem">
        <Typography variant="body-compact-01">{subHeading}</Typography>
        <Typography variant="heading-06">{`${reporting}/${reporting + notreporting}`}</Typography>
        <MeterChart
          data={[
            {
              group: group1,
              value: reporting
            },
            {
              group: group2,
              value: notreporting
            }
          ]}
          options={{
            toolbar: {
              enabled: false
            },
            meter: {
              showLabels: false
            },
            color: {
              scale: {
                group1: 'var(--ids-color-option-green-800)',
                group2: 'var(--ids-color-option-blue-400)'
              }
            },
            height: '50px',
            legend: {
              enabled: true
            }
          }}
        />
        <Typography variant="label-01">
          <Trans
            i18nKey={'in-plg:agentViewKpis.reportingStatus'}
            components={{
              reporting: reporting,
              datasource: t('in-plg:agentViewKpis.agents'),
              nonReporting: notreporting
            }}
          />
        </Typography>
      </Stack>
    </Card>
  );
};

export default AgentViewKpis;
