/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { WebsiteEventBasedSliEntity, WebsiteSliEntity, WebsiteTimeBasedSliEntity } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { SliEntityLabelProps } from './ApplicationPerspectiveLabels';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import MonitoringEntityLabel from './MonitoringEntityLabel';
import { getLabel } from './ApplicationPerspectiveLabels';

interface UseEntityProps {
  sliEntity: WebsiteSliEntity;
}
type UseWebsitesReturn = [string | undefined, string | undefined];

function useWebsiteLabels({ sliEntity }: UseEntityProps): UseWebsitesReturn {
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
