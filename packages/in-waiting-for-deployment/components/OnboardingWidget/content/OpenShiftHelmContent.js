/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import {
  Bash,
  HelpBox,
  Input,
  Row,
  Spacer,
  TextWithLink,
  ValidatedInputFields
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { clusterNameValidator } from 'in-waiting-for-deployment/components/OnboardingWidget/content/validators';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import { t } from 'in-i18n';

export default function OpenShiftHelmContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'clusterName',
          placeholder: t('in-waiting-for-deployment:content.clusterNameEGProd'),
          validate: clusterNameValidator
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input
              id="zone-name"
              value={zoneName}
              onChange={onZoneNameChange}
              placeholder={t('in-waiting-for-deployment:content.agentZoneOptional')}
            />
          </Row>
          <Bash
            disabledErrorMessage={clusterNameValidationMessage}
            lines={[
              'helm install instana-agent \\',
              `--repo https://agents.instana.${instanaDomain}/helm \\`,
              '--namespace instana-agent \\',
              '--create-namespace \\',
              '--set openshift=true \\',
              `--set agent.key=${agentKey} \\`,
              `--set agent.endpointHost=${agentEndpoint} \\`,
              `--set agent.endpointPort=${agentEndpointPort} \\`,
              `--set cluster.name='${clusterName}' \\`,
              `--set zone.name='${zoneName}' \\`,
              'instana-agent'
            ]}
          />
          <Spacer />
          <HelpBox>
            <TextWithLink
              i18nKey="in-waiting-for-deployment:content.helmVersion3IsRequiredForMoreInformationVisitTheOpenShift"
              href="https://instana.com/docs/ecosystem/openshift/"
            />
          </HelpBox>
        </>
      )}
    />
  );
}
