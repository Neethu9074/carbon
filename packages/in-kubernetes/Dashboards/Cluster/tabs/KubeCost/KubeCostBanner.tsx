/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Spacer } from '@instana/components';

import { getUpgradeBannerMessage } from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/utils';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import Banner from 'in-kubernetes/Dashboards/Cluster/tabs/Banner/Banner';
import { t } from 'in-i18n';

interface KubeCostBannerProps {
  coreCount: number;
}

export default function KubeCostBanner({ coreCount }: KubeCostBannerProps) {
  const { trackCta } = useSegmentTracking();
  const bannerMessage = getUpgradeBannerMessage(coreCount, trackCta);

  return (
    <>
      <Banner
        targetProductName="KubeCost"
        expanded="showKubeCostInfoPanel"
        variation="upgrade"
        headline={t('in-kubernetes:dashboards.kubecost.upgradeLicense')}
        tag={t('in-kubernetes:dashboards.kubecost.upgradeNow')}
        showLabel={t('in-kubernetes:dashboards.kubecost.showEnterprise')}
        description={t('in-kubernetes:dashboards.kubecost.upgradeDescription')}
        primaryCta={{
          label: t('in-kubernetes:dashboards.kubecost.upgradeNow'),
          href: 'https://www.apptio.com/products/kubecost/contact/?utm_medium=referral&utm_source=instana-app&utm_campaign=cloud-dvop_global-global-en_kubecost&utm_term=instana',
          target: '_blank'
        }}
        secondaryCta={{
          label: t('in-kubernetes:dashboards.kubecost.learnMore'),
          href: 'https://www.kubecost.com/pricing',
          target: '_blank'
        }}
      />
      <Spacer size="normal" />
      {bannerMessage}
      <Spacer size="normal" />
    </>
  );
}
