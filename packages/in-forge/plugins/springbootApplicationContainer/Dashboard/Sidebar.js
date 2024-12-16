/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionItem, DescriptionList } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { t } from 'in-i18n';
import Info from '../Info';

export default function SpringbootSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const applicationConfig = data.get('applicationConfig');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.springbootAppContainer.headerApplicationInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {applicationConfig ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>
            {t('in-forge:plugins.springbootAppContainer.headerApplicationConfigs')}
          </Collapsible.Header>
          <Collapsible.Content>
            {applicationConfig
              .map((applicationConfigData, applicationConfigPath) => (
                <div>
                  <DescriptionList>
                    <DescriptionItem title={t('in-forge:plugins.springbootAppContainer.titleConfigPath')}>
                      {applicationConfigPath}
                    </DescriptionItem>
                  </DescriptionList>
                  <KeyValueOverlay
                    header={t('in-forge:plugins.springbootAppContainer.headerProperties')}
                    data={applicationConfigData}
                  />
                </div>
              ))
              .valueSeq()
              .toArray()}
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
