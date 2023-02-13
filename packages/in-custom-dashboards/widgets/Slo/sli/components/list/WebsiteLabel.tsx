/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { WebsiteEventBasedSliEntity, WebsiteSliEntity, WebsiteTimeBasedSliEntity } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { SliEntityLabelProps } from 'in-custom-dashboards/widgets/Slo/sli/components/list/ApplicationPerspectiveLabels';
import MonitoringEntityLabel from 'in-custom-dashboards/widgets/Slo/sli/components/list/MonitoringEntityLabel';
import { getLabel } from 'in-custom-dashboards/widgets/Slo/sli/components/list/ApplicationPerspectiveLabels';
import getWebsite from 'in-websites/subscriptions/getWebsite';

interface UseWebsiteLabelsProps {
  sliEntity: WebsiteSliEntity;
}
type UseWebsitesReturn = [string | undefined, string | undefined];

function useWebsiteLabels({ sliEntity }: UseWebsiteLabelsProps): UseWebsitesReturn {
  const { websiteId, beaconType } = sliEntity;
  const websiteLabels = useObservable(() => {
    if (!websiteId) return undefined;
    return getWebsite({ id: websiteId }).map(getLabel);
  }, [websiteId]);

  const beaconLabels = t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconLabel', { context: beaconType });

  return [websiteLabels ?? undefined, beaconLabels ?? undefined];
}

export function WebsiteLabel({
  sliName,
  sliEntity
}: SliEntityLabelProps<WebsiteEventBasedSliEntity | WebsiteTimeBasedSliEntity>) {
  const [websiteLabel, beaconType] = useWebsiteLabels({
    sliEntity
  });

  return <MonitoringEntityLabel sliName={sliName} entityLabel={websiteLabel} serviceLabel={beaconType} />;
}
