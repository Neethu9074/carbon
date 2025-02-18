/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { WebsiteEventBasedSliEntity, WebsiteSliEntity, WebsiteTimeBasedSliEntity } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { SliEntityLabelProps } from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/ApplicationPerspectiveLabel';
import MonitoredEntityLabel from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/MonitoredEntityLabel';
import { getLabel } from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/ApplicationPerspectiveLabel';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { t } from 'in-i18n';

interface UseWebsiteLabelsProps {
  sliEntity: WebsiteSliEntity;
}
interface UseWebsitesReturn {
  websiteLabel?: string;
  beaconLabel: string;
}

function useWebsiteLabel({ sliEntity }: UseWebsiteLabelsProps): UseWebsitesReturn {
  const { websiteId, beaconType } = sliEntity;
  const websiteLabel =
    useObservable(() => {
      if (!websiteId) return undefined;
      return getWebsite({ id: websiteId }).map(getLabel);
    }, [websiteId]) ?? undefined;

  const beaconLabel = t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconLabel', { context: beaconType });

  return { websiteLabel, beaconLabel };
}

export function WebsiteLabel({
  sliName,
  sliEntity
}: SliEntityLabelProps<WebsiteEventBasedSliEntity | WebsiteTimeBasedSliEntity>) {
  const { websiteLabel, beaconLabel } = useWebsiteLabel({
    sliEntity
  });

  return <MonitoredEntityLabel sliName={sliName} entityLabel={websiteLabel} serviceLabel={beaconLabel} />;
}
