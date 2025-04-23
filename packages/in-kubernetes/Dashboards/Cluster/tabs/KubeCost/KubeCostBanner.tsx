/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link, Message, Spacer } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost.mless';

interface KubeCostBannerProps {
  isEnterprise: Boolean;
  coreCount: number;
}
export default function KubeCostMetrics({ isEnterprise, coreCount }: KubeCostBannerProps) {
  return (
    <>
      {!isEnterprise ? (
        coreCount < 200 ? (
          <Message
            fullInlineWidth
            className={locals.message}
            title={t('in-kubernetes:dashboards.kubecost.restrictdata')}
            description={t('in-kubernetes:dashboards.kubecost.enterpriseLicense')}
          >
            <Link href={'https://www.kubecost.com/contact/ '}>{t('in-kubernetes:dashboards.kubecost.upgradeNow')}</Link>
          </Message>
        ) : coreCount < 250 ? (
          <Message
            fullInlineWidth
            className={locals.message}
            title={t('in-kubernetes:dashboards.kubecost.coreNearing250')}
            description={t('in-kubernetes:dashboards.kubecost.enterpriseLicense')}
          >
            <Link href={'https://www.kubecost.com/contact/ '}>{t('in-kubernetes:dashboards.kubecost.upgradeNow')}</Link>
          </Message>
        ) : (
          <Message
            type="warning"
            fullInlineWidth
            className={locals.message}
            title={t('in-kubernetes:dashboards.kubecost.limitedReached')}
            description={t('in-kubernetes:dashboards.kubecost.continueKubecostEnterprise')}
          >
            <Link href={'https://www.kubecost.com/contact/ '}>{t('in-kubernetes:dashboards.kubecost.upgradeNow')}</Link>
          </Message>
        )
      ) : null}
      <Spacer size="normal" />
    </>
  );
}
