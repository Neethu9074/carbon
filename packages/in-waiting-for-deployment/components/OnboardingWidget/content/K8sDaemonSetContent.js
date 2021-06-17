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
import { clusterNameValidator } from 'in-waiting-for-deployment/components/OnboardingWidget/content/validators';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import instanaAgentYaml from 'in-waiting-for-deployment/components/OnboardingWidget/content/instana-agent.yaml';
import { t } from 'in-i18n';

export default function K8sDaemonSetContent({ agentKey, agentEndpoint, agentEndpointPort }) {
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
            title={t('in-waiting-for-deployment:content.instanaAgent')}
            disabledErrorMessage={clusterNameValidationMessage}
            content={getKubernetesYamlConfig(
              agentKey,
              agentEndpoint,
              agentEndpointPort,
              clusterName,
              zoneName,
              instanaAgentYaml
            )}
          />
          <HelpBox>
            <TextWithLink
              text={t('in-waiting-for-deployment:content.forMoreInformationVisitThe')}
              href="https://instana.com/docs/ecosystem/kubernetes/"
              linkText={t('in-waiting-for-deployment:content.instanaKubernetesDocumentation')}
            />
          </HelpBox>
        </>
      )}
    />
  );
}

export function getKubernetesYamlConfig(agentKey, agentEndpoint, agentEndpointPort, clusterName, zoneName, yamlConfig) {
  return yamlConfig
    .replace('${agentKey}', btoa(agentKey))
    .replace('${agentEndpoint}', agentEndpoint)
    .replace('${agentEndpointPort}', agentEndpointPort)
    .replace('${clusterName}', clusterName)
    .replace('${zoneName}', zoneName)
    .replace('${instanaMvnRepoUrl}', `https://artifact-public.instana.${instanaDomain}`);
}
