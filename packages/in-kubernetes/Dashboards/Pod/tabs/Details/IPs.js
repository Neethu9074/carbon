/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';
import { t } from 'in-i18n';

export default function IPs({ resource: pod }) {
  return (
    <Card title={t('in-kubernetes:dashboards.iPs')}>
      <Dl>
        <Di title={t('in-kubernetes:dashboards.hostIp')}>{pod.hostIp || valueMissingPlaceholder}</Di>
        <Di title={t('in-kubernetes:dashboards.podIp')}>{pod.podIp || valueMissingPlaceholder}</Di>
      </Dl>
    </Card>
  );
}
