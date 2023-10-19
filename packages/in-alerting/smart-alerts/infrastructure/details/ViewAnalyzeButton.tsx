/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Stack } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
// eslint-disable-next-line no-restricted-imports
import { Grouping } from 'in-custom-dashboards/widgets/Table/types';
import { getLinkToUnboundAnalytics } from 'in-events/components/AnalyzeInfraEventButton';
import { InfraAlertConfigWithMetadata } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/details/ViewAnalyzeButton.mless';

export default function ViewAnalyzeButton({ alertConfig }: { alertConfig: InfraAlertConfigWithMetadata }) {
  const { tagFilterExpression, rule, groupBy } = alertConfig;
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  const groupByArray = groupBy?.map(tag => {
    return {
      groupbyTag: tag,
      groupbyTagEntity: 'NOT_APPLICABLE',
      tagType: 'STRING'
    };
  });

  const linkToUA = getLinkToUnboundAnalytics(
    rule,
    tagFilterExpression,
    getLinkToInfraEntityExplore,
    undefined,
    groupByArray as Partial<Grouping[]>
  );
  return (
    <Stack gap="normal">
      <Button className={locals.viewDetailButton} kind="primaryv2" icon="lib_analyze_inverted" href={linkToUA}>
        {t('in-alerting:smartAlerts.infrastructure.alertDetails.viewDetail')}
      </Button>
    </Stack>
  );
}
