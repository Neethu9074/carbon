/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import {
  HelpBox,
  Input,
  Row,
  TextWithLink,
  ValidatedInputFields,
  YAMLFile
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { getKubernetesYamlConfig } from 'in-waiting-for-deployment/components/OnboardingWidget/content/K8sDaemonSetContent';
import instanaAgentOpenShiftYaml from 'in-waiting-for-deployment/components/OnboardingWidget/content/instana-agent-openshift.yaml';
import { clusterNameValidator } from 'in-waiting-for-deployment/components/OnboardingWidget/content/validators';
import { t } from 'in-i18n';

export default function OpenShiftDaemonSetContent({ agentKey, agentEndpoint, agentEndpointPort }) {
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
          <YAMLFile
            title="instana-agent.yaml"
            disabledErrorMessage={clusterNameValidationMessage}
            content={getKubernetesYamlConfig(
              agentKey,
              agentEndpoint,
              agentEndpointPort,
              clusterName,
              zoneName,
              instanaAgentOpenShiftYaml
            )}
          />
          <HelpBox>
            <TextWithLink
              text={t('in-waiting-for-deployment:content.forMoreInformationVisitThe')}
              href="https://instana.com/docs/ecosystem/openshift/"
              linkText={t('in-waiting-for-deployment:content.instanaOpenShiftDocumentation')}
            />
          </HelpBox>
        </>
      )}
    />
  );
}
