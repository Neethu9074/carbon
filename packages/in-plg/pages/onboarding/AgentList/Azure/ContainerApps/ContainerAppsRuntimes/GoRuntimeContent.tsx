/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Typography, KeyValue } from '@instana/components';
import { Link } from '@instana/components';

import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import { Trans, t } from 'in-i18n';

export default function GoRuntimeContent({ agentKey, serverlessEndpoint }: OnboardingProps): JSX.Element {
  return (
    <Wrapper>
      <LayoutSection
        title={
          t('in-plg:agentDetails.common.step2') +
          t('in-plg:agentDetails.azure.reviewPrerequisitesAndConfigureContainerApps')
        }
      >
        <Stack>
          <Typography variant="body-regular">
            <Trans
              i18nKey={'in-plg:agentDetails.azure.referenceToAzureContainerAppsDocumentation'}
              components={{
                azureContainerAppsDoc: (
                  <Link href="https://ibm.biz/azure-container-app-trace-go" target="_blank">
                    {t('in-plg:agentDetails.azure.referenceToAzureContainerAppsDocumentation')}
                  </Link>
                )
              }}
            />
          </Typography>
        </Stack>
      </LayoutSection>

      <LayoutSection
        title={
          t('in-plg:agentDetails.common.step3') + t('in-plg:agentDetails.azure.containerAppSetEnvironmentVariables')
        }
      >
        <Wrapper>
          <Stack direction="horizontal">
            <KeyValue
              label={'INSTANA_ENDPOINT_URL'}
              value={<InputWithButton type="copy" inputValue={serverlessEndpoint} />}
              withGap
            />
            <KeyValue
              label={'INSTANA_AGENT_KEY'}
              value={<InputWithButton type="copy" inputValue={agentKey ? agentKey : ''} />}
              withGap
            />
          </Stack>
          <Stack direction="horizontal">
            <KeyValue
              label={'AZURE_SUBSCRIPTION_ID'}
              value={<InputWithButton type="copy" inputValue={'your_azure_subscription_id'} />}
              withGap
            />
            <KeyValue
              label={'AZURE_RESOURCE_GROUP'}
              value={<InputWithButton type="copy" inputValue={'your_azure_resource_group'} />}
              withGap
            />
          </Stack>
        </Wrapper>
      </LayoutSection>
    </Wrapper>
  );
}
