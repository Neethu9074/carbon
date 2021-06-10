/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
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
