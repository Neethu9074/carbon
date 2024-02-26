/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import CodeComponent from 'in-components/Code';

import locals from 'in-synthetics/createLocation/steps/DeployTabSelection.mless';

interface RedisTLSDeployContentProps {
  redisCode: string;
}

export default function RedisTLSDeployContent({ redisCode }: RedisTLSDeployContentProps) {
  return (
    <>
      <CodeComponent code={redisCode} lang="json" showLineNumbers={false} withoutCopyButton />
      <Card className={locals.primaryText}>{t('in-synthetics:dashboard.testList.popDialog.tlsInstructions')}</Card>
      <CodeComponent
        code={t('in-synthetics:dashboard.testList.popDialog.tlsConfiguration')}
        lang="json"
        showLineNumbers={false}
        withoutCopyButton
      />
      <Card className={locals.primaryText}>
        {t('in-synthetics:dashboard.testList.popDialog.tlsSecretInstructions')}
      </Card>
      <CodeComponent
        code={t('in-synthetics:dashboard.testList.popDialog.tlsSecretConfigurations')}
        lang="json"
        showLineNumbers={false}
        withoutCopyButton
      />
    </>
  );
}
