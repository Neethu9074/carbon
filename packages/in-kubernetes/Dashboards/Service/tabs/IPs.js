/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue, Typography } from '@instana/components';
import { Li, Ul } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { t } from 'in-i18n';

export default function IPs({ resource: service }) {
  return (
    <>
      <Typography variant="heading-03">{t('in-kubernetes:dashboards.iPs')}</Typography>
      <Ul>
        <Li>
          <KeyValue
            value={service.location || valueMissingPlaceholder}
            label={t('in-kubernetes:dashboards.clusterIp')}
          />
        </Li>
        <Li>
          <KeyValue
            value={service.externalIP || valueMissingPlaceholder}
            label={t('in-kubernetes:dashboards.externalIp')}
          />
        </Li>
      </Ul>
    </>
  );
}
