/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function EngineList({ snapshot }: { snapshot: any }) {
  const browserStatus = snapshot.getIn(['data', 'browserscript.workloadStatus']);
  const javascriptStatus = snapshot.getIn(['data', 'javascript.workloadStatus']);
  const httpStatus = snapshot.getIn(['data', 'http.workloadStatus']);
  const ismStatus = snapshot.getIn(['data', 'ism.workloadStatus']);
  const status = snapshot.getIn(['data', 'status']);

  return (
    <>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.syntheticPoP.dashboard.status')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {status && (
              <DescriptionItem title={t('in-forge:plugins.syntheticPoP.dashboard.status')}>{status}</DescriptionItem>
            )}
            {httpStatus && (
              <DescriptionItem title={t('in-forge:plugins.syntheticPoP.dashboard.httpWorkload')}>
                {httpStatus}
              </DescriptionItem>
            )}
            {javascriptStatus && (
              <DescriptionItem title={t('in-forge:plugins.syntheticPoP.dashboard.javascriptWorkload')}>
                {javascriptStatus}
              </DescriptionItem>
            )}
            {browserStatus && (
              <DescriptionItem title={t('in-forge:plugins.syntheticPoP.dashboard.browserWorkload')}>
                {browserStatus}
              </DescriptionItem>
            )}
            {ismStatus && (
              <DescriptionItem title={t('in-forge:plugins.syntheticPoP.dashboard.ismWorkload')}>
                {ismStatus}
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </>
  );
}
