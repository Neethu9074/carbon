/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { modes, logLevels } from 'in-forge/plugins/instanaAgent/modes';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const java = snapshot.getIn(['data', 'java'], emptyMap);
  const startedAt = data.get('startedAt');
  const origin = data.get('origin');
  const agentVersion = data.get('agentVersion');
  const updateMode = data.get('updateMode');

  return (
    <DescriptionList>
      {agentVersion && (
        <DescriptionItem title={t('in-forge:plugins.instanaAgent.agentVersion')}>{agentVersion}</DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.instanaAgent.bootVersion')}>{data.get('boot')}</DescriptionItem>
      {origin && <DescriptionItem title={t('in-forge:plugins.instanaAgent.origin')}>{origin}</DescriptionItem>}
      {updateMode && (
        <DescriptionItem title={t('in-forge:plugins.instanaAgent.updateMode')}>{updateMode}</DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.instanaAgent.logLevel')}>
        {logLevels[data.get('loglevel')]}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.instanaAgent.mode')}>{modes[data.get('mode')]}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.instanaAgent.javaRuntime')}>
        {java.get('vmvendor')} {java.get('vmname') && `(${java.get('vmname')})`}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.instanaAgent.javaVersion')}>
        {java.get('version')} {java.get('vmversion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.instanaAgent.user')}>{data.get('user')}</DescriptionItem>
      {startedAt != null && (
        <DescriptionItem title={t('in-forge:plugins.instanaAgent.startedAt')}>
          {formatDateTime(startedAt)} ({fromNowAccurately(startedAt)})
        </DescriptionItem>
      )}
    </DescriptionList>
  );
}
