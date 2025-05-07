/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link, Message, Spacer } from '@instana/components';

import {
  KUBECOST_VCPU_LIMIT_REACHED_UPGRADE_NOW_CLICK,
  KUBECOST_VCPU_NEARING_LIMIT_UPGRADE_NOW_CLICK,
  KUBECOST_VCPU_RESTRICTED_UPGRADE_NOW_CLICK
} from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import Banner from 'in-kubernetes/Dashboards/Cluster/tabs/Banner/Banner';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost.mless';

interface KubeCostBannerProps {
  isEnterprise: Boolean;
  coreCount: number;
}
export default function KubeCostMetrics({ isEnterprise, coreCount }: KubeCostBannerProps) {
  const { trackCta } = useSegmentTracking();
  return (
    <>
      {!isEnterprise && (
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
      )}
      <Spacer size="normal" />
      {!isEnterprise ? (
        coreCount < 200 ? (
          <Message
            fullInlineWidth
            className={locals.message}
            title={t('in-kubernetes:dashboards.kubecost.restrictdata')}
            description={t('in-kubernetes:dashboards.kubecost.enterpriseLicense')}
          >
            <Link
              href={'https://www.kubecost.com/contact/ '}
              onClick={() => trackCta(KUBECOST_VCPU_RESTRICTED_UPGRADE_NOW_CLICK)}
            >
              {t('in-kubernetes:dashboards.kubecost.upgradeNow')}
            </Link>
          </Message>
        ) : coreCount < 250 ? (
          <Message
            fullInlineWidth
            className={locals.message}
            title={t('in-kubernetes:dashboards.kubecost.coreNearing250')}
            description={t('in-kubernetes:dashboards.kubecost.enterpriseLicense')}
          >
            <Link
              href={'https://www.kubecost.com/contact/ '}
              onClick={() => trackCta(KUBECOST_VCPU_NEARING_LIMIT_UPGRADE_NOW_CLICK)}
            >
              {t('in-kubernetes:dashboards.kubecost.upgradeNow')}
            </Link>
          </Message>
        ) : (
          <Message
            type="warning"
            fullInlineWidth
            className={locals.message}
            title={t('in-kubernetes:dashboards.kubecost.limitedReached')}
            description={t('in-kubernetes:dashboards.kubecost.continueKubecostEnterprise')}
          >
            <Link
              href={'https://www.kubecost.com/contact/ '}
              onClick={() => trackCta(KUBECOST_VCPU_LIMIT_REACHED_UPGRADE_NOW_CLICK)}
            >
              {t('in-kubernetes:dashboards.kubecost.upgradeNow')}
            </Link>
          </Message>
        )
      ) : null}
      <Spacer size="normal" />
    </>
  );
}
