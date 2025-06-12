/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Typography, Ul, Li, KeyValue } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { t } from 'in-i18n';

export default function IPs({ resource: node }) {
  return (
    <>
      <Typography variant="heading-03">{t('in-kubernetes:dashboards.iPs')}</Typography>
      <Ul>
        <Li>
          <KeyValue
            value={node.internalIp || valueMissingPlaceholder}
            label={t('in-kubernetes:dashboards.internalIp')}
          />
        </Li>
        <Li>
          <KeyValue
            value={node.externalIp || valueMissingPlaceholder}
            label={t('in-kubernetes:dashboards.externalIp')}
          />
        </Li>
      </Ul>
    </>
  );
}
