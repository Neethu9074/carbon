/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { RadioButton } from '@instana/components';

import {
  Description,
  DownloadButton,
  getAgentDownloadURL,
  Row,
  Script,
  Spacer
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { Col, Row as GridRow } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function WindowsInstallerContent({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  butlerDomain,
  tenant,
  tenantUnit
}) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  return (
    <>
      <Row>
        <>
          <h4>{t('in-waiting-for-deployment:content.agentModeLabel')}</h4>
          <p>
            <RadioButton
              label={t('in-waiting-for-deployment:content.agentModeDynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
            />
          </p>
          <p>
            <RadioButton
              label={t('in-waiting-for-deployment:content.agentModeStatic')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
            />
          </p>
        </>

        <>
          <h4>{t('in-waiting-for-deployment:content.agentRuntimeLabel')}</h4>
          <p>
            <RadioButton
              label="Azul Zulu 11"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
            />
          </p>
          <p>
            <RadioButton
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
            />
          </p>
        </>
      </Row>
      <Row>
        <DownloadButton
          title={t('in-waiting-for-deployment:content.download')}
          href={getAgentDownloadURL(
            tenant,
            tenantUnit,
            agentKey,
            downloadKey,
            `exe64${jvmVendor === jvmVendorOptions[0] ? '' : 'j9'}${
              agentMode === agentModeOptions[0] ? '' : 'offline'
            }`,
            butlerDomain
          )}
        />
      </Row>
      <Spacer />
      <Description
        lines={[
          t('in-waiting-for-deployment:content.launchTheInstallerAsAnApplicationAndSupplyTheFollowingConfiguration')
        ]}
      />
      <Spacer />
      <GridRow>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaBackendAddress')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaBackendPort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaAgentKey')]} />
          <Script lines={[agentKey]} />
        </Col>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.downloadKey')]} />
          <Script lines={[downloadKey]} />
        </Col>
      </GridRow>
    </>
  );
}
