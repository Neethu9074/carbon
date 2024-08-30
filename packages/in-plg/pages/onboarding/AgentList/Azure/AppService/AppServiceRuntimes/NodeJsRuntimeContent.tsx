/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue } from '@instana/components';
import { Link } from '@instana/components';

import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import Code from 'in-plg/components/Code/Code';
import { Trans, t } from 'in-i18n';

export default function NodeJsRuntimeContent({ agentKey, serverlessEndpoint }: OnboardingProps): JSX.Element {
  const [appName, setAppName] = useState('my-azure-app');
  const [resourceGroup, setResourceGroup] = useState('my-resource-group');
  return (
    <Wrapper>
      <LayoutSection
        title={
          t('in-plg:agentDetails.common.step2') +
          t('in-plg:agentDetails.azure.nodejs.reviewPrerequisitesAndInstallAppService')
        }
      >
        <Stack>
          <Typography variant="body-regular">
            <Trans
              i18nKey={'in-plg:agentDetails.azure.nodejs.referenceAppServiceDocumentationContent'}
              components={{
                azureAppServiceDoc: (
                  <Link href="https://ibm.biz/azure-tracing-nodejs" target="_blank">
                    {t('in-plg:agentDetails.azure.nodejs.referenceAppServiceDocumentationContent')}
                  </Link>
                )
              }}
            />
          </Typography>
        </Stack>
      </LayoutSection>

      <LayoutSection
        title={t('in-plg:agentDetails.common.step3') + t('in-plg:agentDetails.azure.nodejs.activatingAppService')}
      >
        <Stack>
          <Typography variant="body-regular">
            <Trans i18nKey={'in-plg:agentDetails.azure.nodejs.activatingAppServiceContent'} />
          </Typography>
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.azure.nodejs.appName')}
              value={<FormInputPlg value={appName} onChange={setAppName} />}
              withGap
            />
            <KeyValue
              label={t('in-plg:agentDetails.azure.nodejs.resourceGroupName')}
              value={<FormInputPlg value={resourceGroup} onChange={setResourceGroup} />}
              withGap
            />
          </Stack>
          <Code
            lang="bash"
            code={[
              `az webapp config appsettings set \\`,
              `  --name ${appName} \\`,
              `  --resource-group ${resourceGroup} \\`,
              `  --settings NODE_OPTIONS='--import ./node_modules/@instana/azure-container-services/esm-register.mjs' \\`,
              `   INSTANA_ENDPOINT_URL=${serverlessEndpoint} INSTANA_AGENT_KEY=${agentKey}`
            ]}
          />
          <Typography variant="body-regular">
            <Trans
              i18nKey={'in-plg:agentDetails.azure.nodejs.activatingAppServiceNote'}
              components={{
                azureAppServiceEnableCollectorDoc: (
                  <Link href="https://ibm.biz/enable-collector-azure-cli" target="_blank">
                    {t('in-plg:agentDetails.azure.nodejs.referenceAppServiceDocumentationContent')}
                  </Link>
                )
              }}
            />
          </Typography>
        </Stack>
      </LayoutSection>
    </Wrapper>
  );
}
