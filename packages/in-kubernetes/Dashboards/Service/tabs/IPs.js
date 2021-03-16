/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';
import { t } from 'in-i18n';

export default function IPs({ resource: service }) {
  return (
    <Card title={t('in-kubernetes:dashboards.iPs')}>
      <Dl>
        <Di title={t('in-kubernetes:dashboards.clusterIp')}>{service.location || valueMissingPlaceholder}</Di>
        <Di title={t('in-kubernetes:dashboards.externalIp')}>{service.externalIP || valueMissingPlaceholder}</Di>
      </Dl>
    </Card>
  );
}
