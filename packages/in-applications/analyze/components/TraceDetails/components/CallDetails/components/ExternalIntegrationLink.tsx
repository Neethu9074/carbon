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

interface QueryPaths {
  [key: string]: string;
}

const queryPaths: QueryPaths = {
  DBMARLIN: '/sql-search?sql='
};

const ExternalIntegrationLink = ({ integrations, statement }: { integrations: Integration[]; statement: string }) => {
  return (
    <>
      {integrations.map((integration: Integration) => {
        const normalizedUrl = integration.url.replace(/\/$/, '');
        return (
          <Button
            key={integration.url}
            href={`${normalizedUrl}${queryPaths[integration.type]}${encodeURIComponent(statement)}`}
            target="_blank"
            kind="action"
            className={locals.marginBottom}
          >
            {t('in-analyze:traceDetail.components.callDetails.findSQL', {
              type: integration.type
            })}
          </Button>
        );
      })}
    </>
  );
};
export default ExternalIntegrationLink;
