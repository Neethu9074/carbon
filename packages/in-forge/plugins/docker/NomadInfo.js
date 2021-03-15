/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { megaBytesTwoDecimalPlaces } from 'in-services/formatters/number';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';

export default function NomadInfo({ snapshot }) {
  const nomad = snapshot.getIn(['data', 'Nomad']);
  if (!nomad || nomad.size === 0) {
    return null;
  }

  const ports = nomad.get('ports');

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.docker.nomad')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.docker.taskName')}>{nomad.get('taskName')}</DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.taskDirectory')}>{nomad.get('taskDir')}</DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.allocationId')}>{nomad.get('allocId')}</DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.allocationName')}>
              {nomad.get('allocName')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.allocationDirectory')}>
              {nomad.get('allocDir')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.jobName')}>{nomad.get('jobName')}</DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.cpuLimit')}>
              {nomad.get('cpuLimit') ? `${nomad.get('cpuLimit')} MHz` : null}
            </DescriptionItem>
            {nomad.get('memoryLimit') && (
              <DescriptionItem title={t('in-forge:plugins.docker.memoryLimit')}>
                {megaBytesTwoDecimalPlaces(nomad.get('memoryLimit'))}
              </DescriptionItem>
            )}
          </DescriptionList>

          {ports && ports.size > 0 ? (
            <KeyValueOverlay header={t('in-forge:plugins.docker.portNames')} data={ports} />
          ) : null}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
