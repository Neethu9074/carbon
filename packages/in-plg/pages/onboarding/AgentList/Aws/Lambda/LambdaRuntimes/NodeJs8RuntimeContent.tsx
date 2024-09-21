/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';
import { Link } from '@instana/components';

import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import { Trans, t } from 'in-i18n';

export default function NodeJs8RuntimeContent(): JSX.Element {
  return (
    <Wrapper>
      <LayoutSection
        title={
          t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.setupUpInstanaAwsSensorRunningInAwsRegion')
        }
      >
        <Typography variant="body-regular">
          <Trans
            i18nKey={'in-plg:agentDetails.aws.referDocumentationForSettingUpAwsSensor'}
            components={{
              awsSensorDoc: (
                <Link href="https://ibm.biz/monitor-aws" target="_blank">
                  {t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
                </Link>
              )
            }}
          />
        </Typography>
      </LayoutSection>

      <LayoutSection
        title={t('in-plg:agentDetails.aws.step3') + t('in-plg:agentDetails.aws.reviewPrerequisitesAndConfigureLambda')}
      >
        <Stack direction="vertical">
          <Typography variant="body-regular">
            <Trans
              i18nKey={'in-plg:agentDetails.aws.preferredMethodForNodeJsLambdaConfiguration'}
              components={{
                lambdaManualWrapping: (
                  <Link href="https://ibm.biz/lambda-layer-manual-wrapping" target="_blank">
                    {t('in-plg:agentDetails.aws.instanaLambdaLayerManualWrapping')}
                  </Link>
                )
              }}
            />
          </Typography>
          <Typography variant="body-regular">
            <Trans
              i18nKey={'in-plg:agentDetails.aws.referenceToAwsLambdaMonitoringDoc'}
              components={{
                awsLambdaMonitoring: (
                  <Link href="https://ibm.biz/monitor-aws-lambda" target="_blank">
                    {t('in-plg:agentDetails.aws.monitoringAwsLambdaDocumentation')}
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
