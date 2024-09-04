/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from './ExternalIntegrationLink.mless';

interface Integration {
  url: string;
  type: string;
}

const ExternalIntegrationLink = ({ integrations }: { integrations: Integration[] }) => {
  return (
    <>
      {integrations.map((integration: Integration) => (
        <Button href={integration.url} target="_blank" kind="subtle" className={locals.marginBottom}>
          {t('in-analyze:traceDetail.components.callDetails.findSQL', {
            type: integration.type
          })}
        </Button>
      ))}
    </>
  );
};
export default ExternalIntegrationLink;
