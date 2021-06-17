/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  Bash,
  Description,
  DownloadButton,
  HelpBox,
  Listing,
  Row,
  Spacer,
  TextWithLink,
  ValidatedInputFields,
  YAMLFile
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { clusterNameValidator } from 'in-waiting-for-deployment/components/OnboardingWidget/content/validators';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import { t } from 'in-i18n';

const agentReleaseVersionRegex = new RegExp(/^\d\.\d{1,3}\.\d+$/);

function validateAgentReleaseVersion(agentReleaseVersion) {
  if (!agentReleaseVersionRegex.test(agentReleaseVersion)) {
    return [
      {
        severity: 'error',
        message: t('in-waiting-for-deployment:content.theAgentReleaseVersionMustBeAValidSemanticVersion')
      }
    ];
  }
  return null;
}

function validateNotEmpty(value, message) {
  if (!value) {
    return [
      {
        severity: 'error',
        message: message
      }
    ];
  }
  return null;
}

export default function CfAndBoshContent({ agentKey, agentEndpoint }) {
  return (
    <>
      <ValidatedInputFields
        fields={[
          {
            name: 'agentReleaseVersion',
            placeholder: t('in-waiting-for-deployment:content.placeholderReleaseVersionEG001'),
            validate: validateAgentReleaseVersion
          },
          {
            name: 'foundationName',
            placeholder: t('in-waiting-for-deployment:content.placeholderFoundationNameEGProd'),
            validate: clusterNameValidator
          },
          {
            name: 'clientId',
            placeholder: t('in-waiting-for-deployment:content.placeholderUaaClientIdEGMyClientId'),
            validate: str => {
              validateNotEmpty(str, t('in-waiting-for-deployment:content.theUaaClientIdCannotBeBlank'));
            }
          },
          {
            name: 'clientSecret',
            placeholder: t('in-waiting-for-deployment:content.placeholderUaaClientSecretEGMyClientSecret'),
            validate: str => {
              validateNotEmpty(str, t('in-waiting-for-deployment:content.theUaaClientSecretCannotBeBlank'));
            }
          }
        ]}
        renderContent={({
          foundationName,
          foundationNameInput,
          foundationNameValidationMessage,
          agentReleaseVersion,
          agentReleaseVersionInput,
          agentReleaseVersionValidationMessage,
          clientId,
          clientIdInput,
          clientIdValidationMessage,
          clientSecret,
          clientSecretInput,
          clientSecretValidationMessage
        }) => (
          <>
            <HelpBox title={t('in-waiting-for-deployment:content.supportedStemcells')}>
              <Listing
                items={[
                  t('in-waiting-for-deployment:content.ubuntuTrusty'),
                  t('in-waiting-for-deployment:content.ubuntuXenial')
                ]}
              />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.instanaBoshAgentVersion')}>
              <Description
                lines={[t('in-waiting-for-deployment:content.pleaseProvideTheInstanaBoshReleaseVersionYouWantToUse')]}
              />
              <Row>{agentReleaseVersionInput}</Row>
            </HelpBox>
            <HelpBox title={t('in-waiting-for-deployment:content.uploadTheInstanaBoshReleasesToTheBoshDirector')}>
              <Description lines={[t('in-waiting-for-deployment:content.downloadTheFollowingBoshReleases')]} />
              <DownloadButton
                title={t('in-waiting-for-deployment:content.downloadInstanaAgentRelease')}
                href={`https://_:${agentKey}@artifact-public.instana.${instanaDomain}/artifactory/shared/com/instana/bosh/agent-bosh/${agentReleaseVersion}/agent-bosh-${agentReleaseVersion}.tar.gz`}
              />
              <DownloadButton
                title={t('in-waiting-for-deployment:content.downloadInstanaLeadershipElectionRelease')}
                href={`https://_:${agentKey}@artifact-public.instana.${instanaDomain}/artifactory/shared/com/instana/bosh/leadership-election/${agentReleaseVersion}/leadership-election-${agentReleaseVersion}.tar.gz`}
              />
              <Spacer />
              <Description
                lines={[t('in-waiting-for-deployment:content.uploadTheInstanaBoshReleasesToYourBoshDirector')]}
              />
              <Bash
                lines={[
                  `bosh upload-release agent-bosh-${agentReleaseVersion}.tar.gz`,
                  `bosh upload-release leadership-election-${agentReleaseVersion}.tar.gz`
                ]}
              />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.createTheInstanaUaaClient')}>
              <Description
                lines={[
                  t(
                    'in-waiting-for-deployment:content.createInTheFoundationSUserAccountAndAuthenticationUaaAClientWithCloudControllerAdminReadOnlyAuthority'
                  )
                ]}
              />
              <Row>
                {clientIdInput}
                {clientSecretInput}
              </Row>
              <TextWithLink
                text={t('in-waiting-for-deployment:content.theEasiestWayToCreateTheRequiredUaaClientIsToUseThe')}
                linkText={t('in-waiting-for-deployment:content.uaacTool')}
                href="https://github.com/cloudfoundry/cf-uaac"
              />
              <Description
                lines={[
                  t(
                    'in-waiting-for-deployment:content.replaceInTheCommandsBelowUaaApiEndpointWithYourUaaApiEndpointAndClientsAdminSecretWithYourUaaClientWithClientsAdminOrClientsWriteAuthority'
                  )
                ]}
              />
              <Bash
                lines={[
                  'uaac target <uaa-api-endpoint>',
                  'uaac token client get -s <clients.admin-secret>',
                  `uaac client add '${clientId}' \\`,
                  "  --name 'Instana Cloud Foundry Client' \\",
                  '  --autoapprove true \\',
                  '  --authorized_grant_types client_credentials \\',
                  "  --authorities 'cloud_controller.admin_read_only' \\",
                  `  --secret '${clientSecret}' \\`
                ]}
              />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.instanaBoshAddon')}>
              <TextWithLink
                text={t(
                  'in-waiting-for-deployment:content.boshAddonsAreRuntimeConfigurationsForBoshThatAllowYouToDeclareAdditionalJobsToBeRunInYourDeploymentsForMoreInformationOnBoshRuntimeConfigurationsAndAddonsReferToThe'
                )}
                linkText={t('in-waiting-for-deployment:content.boshRuntimeConfigurationsDocumentation')}
                href="https://bosh.io/docs/runtime-config/"
              />
              <Spacer />
              <Description lines={[t('in-waiting-for-deployment:content.pickANameForYourCloudFoundryFoundation')]} />
              <Row>{foundationNameInput}</Row>
              <Spacer />
              <Description
                lines={[
                  t('in-waiting-for-deployment:content.applyTheFollowingAsBoshRuntimeConfigurationsToYourBoshDirector')
                ]}
              />
              <Row>
                <YAMLFile
                  title={t('in-waiting-for-deployment:content.runtimeConfigYml')}
                  disabledErrorMessage={
                    foundationNameValidationMessage ||
                    agentReleaseVersionValidationMessage ||
                    clientIdValidationMessage ||
                    clientSecretValidationMessage
                  }
                  content={
                    `releases:\n- name: instana-agent\n  version: ${agentReleaseVersion}\n` +
                    `- name: instana-leadership-election\n  version: ${agentReleaseVersion}\n` +
                    'addons:\n' +
                    '- name: instana-agent\n  jobs:\n  - name: instana-agent\n' +
                    '    release: instana-agent\n  properties:\n    tanzu:\n      foundation:\n' +
                    `        id: '${foundationName}'\n` +
                    `        name: '${foundationName}'\n` +
                    '    instana:\n      agent:\n' +
                    `        mode: APM\n        key: '${agentKey}'\n        endpoint: '${agentEndpoint}'\n` +
                    `        zone: '${foundationName}'\n` +
                    '- name: instana-cloudfoundry-sensor\n' +
                    '  jobs:\n' +
                    '  - name: instana-agent-configuration-cf-sensor\n' +
                    '    release: instana-agent\n' +
                    '    properties:\n' +
                    '      tanzu:\n' +
                    '        foundation:\n' +
                    `          id: '${foundationName}'\n` +
                    `          name: '${foundationName}'\n` +
                    '      cf:\n' +
                    '        uaa:\n' +
                    `          client: '${clientId}'\n` +
                    `          client_secret: '${clientSecret}'\n` +
                    '  - name: instana-leadership-election\n' +
                    '    release: instana-leadership-election\n' +
                    '- name: instana-agent-configuration-pxc-mysql\n  jobs:\n  - name: instana-agent-configuration-pxc-mysql\n' +
                    '    release: instana-agent\n  include:\n    lifecycle: service\n    jobs:\n' +
                    '    - name: pxc-mysql\n      release: pxc\n'
                  }
                />
              </Row>
              <TextWithLink
                text={t(
                  'in-waiting-for-deployment:content.forMoreInformationOnHowToSetUpBoshRuntimeConfigurationsReferToThe'
                )}
                linkText={t('in-waiting-for-deployment:content.applyingTheInstanaAgentRuntimeConfigurationsPage')}
                href="https://instana.com/docs/setup_and_manage/host_agent/on/cloud-foundry#applying-the-instana-agent-runtime-configurations"
              />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.dynamicAgentsProxiesAndOtherSettings')}>
              <Description
                lines={[
                  t(
                    'in-waiting-for-deployment:content.theBoshReleaseWillByDefaultInstallStaticHostAgentsButItCanBeConfigureToInstallDynamicHostAgentsInstead'
                  ),
                  t(
                    'in-waiting-for-deployment:content.similarlyTheBoshReleaseCanBeConfiguredSoThatTheInstalledHostAgentsWillTalkToTheInstanaBackendOverAProxy'
                  )
                ]}
              />
              <TextWithLink
                text={t(
                  'in-waiting-for-deployment:content.forMoreInformationOnHostConfigurationsThatYouCanApplyOverTheInstanaAgentBoshReleaseConsultThe'
                )}
                href="https://instana.com/docs/ecosystem/cloudfoundry/"
                linkText={t('in-waiting-for-deployment:content.instanaCloudFoundryDocumentation')}
              />
            </HelpBox>
          </>
        )}
      />
    </>
  );
}
