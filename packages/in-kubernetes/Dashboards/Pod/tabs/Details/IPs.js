/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Typography, Ul, Li, KeyValue } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { t } from 'in-i18n';

export default function IPs({ resource: pod }) {
  return (
    <>
      <Typography variant="heading-03">{t('in-kubernetes:dashboards.iPs')}</Typography>
      <Ul>
        <Li>
          <KeyValue value={pod.hostIp || valueMissingPlaceholder} label={t('in-kubernetes:dashboards.hostIp')} />
        </Li>
        <Li>
          <KeyValue value={pod.podIp || valueMissingPlaceholder} label={t('in-kubernetes:dashboards.podIp')} />
        </Li>
      </Ul>
    </>
  );
}
