/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem, Link } from '@instana/components';

import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { modes, logLevels } from 'in-forge/plugins/instanaAgent/modes';
import { supportsOpenFiles } from 'in-forge/plugins/host/hostUtils';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot }) => ({ hostSnapshot: getHostSnapshotId(snapshot).flatMap(getSnapshot) }),

  function Info({ snapshot, hostSnapshot }) {
    const data = snapshot.get('data');
    const java = snapshot.getIn(['data', 'java'], emptyMap);
    const startedAt = data.get('startedAt');
    const origin = data.get('origin');
    const agentVersion = data.get('agentVersion');
    const updateMode = data.get('updateMode');
    const startType = data.get('startType');
    const openFilesMax = data.get('proc.openFiles.max');
    const isHyperLinkNeeded = isHyperLinkRequired(agentVersion);

    return (
      <DescriptionList>
        {agentVersion && (
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.agentVersion')}>
            {isHyperLinkNeeded ? (
              <Link external href={'https://github.com/instana/agent-updates/releases/tag/' + agentVersion}>
                {agentVersion}
              </Link>
            ) : (
              agentVersion
            )}
          </DescriptionItem>
        )}
        <DescriptionItem title={t('in-forge:plugins.instanaAgent.bootVersion')}>{data.get('boot')}</DescriptionItem>
        {origin && <DescriptionItem title={t('in-forge:plugins.instanaAgent.origin')}>{origin}</DescriptionItem>}
        {updateMode && (
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.updateMode')}>{updateMode}</DescriptionItem>
        )}
        {startType && (
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.startType')}>{startType}</DescriptionItem>
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
        <DescriptionItem title={t('in-forge:plugins.instanaAgent.user')}>
          {data.get('user')} {data.get('proc.group') && ` - ${data.get('proc.group')}`}
        </DescriptionItem>
        {startedAt != null && (
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.startedAt')}>
            {formatDateTime(startedAt)} ({fromNowAccurately(startedAt)})
          </DescriptionItem>
        )}
        <DescriptionItem title={t('in-forge:plugins.process.executable')}>{data.get('proc.exec')}</DescriptionItem>
        {hostSnapshot && supportsOpenFiles(hostSnapshot) && openFilesMax && (
          <DescriptionItem title={t('in-forge:plugins.process.maxOpenFiles')}>
            {zeroDecimalPlaces(openFilesMax)}
          </DescriptionItem>
        )}
        <DescriptionItem title={t('in-forge:plugins.process.processId')}>{data.get('proc.pid')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.process.inContainerId')}>
          {data.get('proc.containerPid')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.process.containerId')}>
          {data.get('proc.container')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
function isHyperLinkRequired(agentVersion) {
  if (typeof agentVersion !== 'string') {
    return;
  }

  if (agentVersion.includes('-')) {
    return false;
  }

  let agentVersionWithoutSpecialCharacter = agentVersion.replaceAll('.', '').trim();

  return agentVersionWithoutSpecialCharacter.localeCompare('202406101442') >= 0;
}
