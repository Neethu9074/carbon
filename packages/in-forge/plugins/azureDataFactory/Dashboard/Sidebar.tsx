/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import TagList from 'in-sdk/components/sidebar/TagList';
// @ts-expect-error Module needs to be translated to TS
import List from 'in-sdk/components/sidebar/List';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';
import Info from '../Info';

export default function AzureDataFactorySidebarDetails({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  const pipelinesList = data.get('pipelinesList', emptyList);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.azureDataFactory.infoAzureDataFactory')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {pipelinesList && pipelinesList.size > 0 && (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>
            {t('in-forge:plugins.azureDataFactory.infoListOfPipelines', { len: pipelinesList.size })}
          </Collapsible.Header>
          <Collapsible.Content>
            <List>
              {pipelinesList.map((pipeline: any) => (
                <List.Item key={pipeline}>{pipeline}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      )}

      <TagList snapshot={snapshot} />
    </div>
  );
}
