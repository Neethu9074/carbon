/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link, Message } from '@instana/components';

import {
  KUBECOST_VCPU_LIMIT_REACHED_UPGRADE_NOW_CLICK,
  KUBECOST_VCPU_NEARING_LIMIT_UPGRADE_NOW_CLICK,
  KUBECOST_VCPU_RESTRICTED_UPGRADE_NOW_CLICK
} from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost.mless';

export function getUpgradeBannerMessage(coreCount: number, trackCta: (eventName: string) => void) {
  if (coreCount < 200) {
    return createMessage(
      t('in-kubernetes:dashboards.kubecost.restrictdata'),
      t('in-kubernetes:dashboards.kubecost.enterpriseLicense'),
      KUBECOST_VCPU_RESTRICTED_UPGRADE_NOW_CLICK,
      trackCta
    );
  }

  if (coreCount < 250) {
    return createMessage(
      t('in-kubernetes:dashboards.kubecost.coreNearing250'),
      t('in-kubernetes:dashboards.kubecost.enterpriseLicense'),
      KUBECOST_VCPU_NEARING_LIMIT_UPGRADE_NOW_CLICK,
      trackCta
    );
  }

  return createMessage(
    t('in-kubernetes:dashboards.kubecost.limitedReached'),
    t('in-kubernetes:dashboards.kubecost.continueKubecostEnterprise'),
    KUBECOST_VCPU_LIMIT_REACHED_UPGRADE_NOW_CLICK,
    trackCta,
    'warning'
  );
}

function createMessage(
  titleKey: string,
  descKey: string,
  trackingKey: string,
  trackCta: (eventName: string) => void,
  type?: 'warning'
) {
  return (
    <Message type={type} fullInlineWidth className={locals.message} title={titleKey} description={descKey}>
      <Link
        href="https://www.apptio.com/products/kubecost/contact/?utm_medium=referral&utm_source=instana-app&utm_campaign=cloud-dvop_global-global-en_kubecost&utm_term=instana"
        onClick={() => trackCta(trackingKey)}
      >
        {t('in-kubernetes:dashboards.kubecost.upgradeNow')}
      </Link>
    </Message>
  );
}
