/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagFilterExpression } from '@instana/types';
import { Button } from '@instana/components';

import {
  GetLinkToExploreProps,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  entityType: string;
  tagFilterExpression: TagFilterExpression;
  timeConfig: TimeConfig;
}

export default function AnalyzeEntityCountVerificationEventButton({
  entityType,
  tagFilterExpression,
  timeConfig
}: Props) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  const linkToUA = getLinkToUnboundAnalytics(entityType, tagFilterExpression, timeConfig, getLinkToInfraEntityExplore);

  return (
    <Button kind="primary" icon="lib_analyze_inverted" href={linkToUA}>
      {t('in-analyze:analyzeHeader.analyzeInfrastructureSelectedTitle')}
    </Button>
  );
}

function getLinkToUnboundAnalytics(
  entityType: string,
  tagFilterExpression: TagFilterExpression,
  timeConfig: TimeConfig,
  getLinkToInfraEntityExplore: (getLinkToExploreProps: GetLinkToExploreProps) => string
): string {
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  return urlWithoutQueryParameter(
    getLinkToInfraEntityExplore({
      tagFilterExpression: tagFilterFormModel,
      type: entityType,
      timeConfig,
      chartedMetrics: [
        {
          metric: 'count',
          aggregation: 'MEAN'
        }
      ]
    })
  );
}
