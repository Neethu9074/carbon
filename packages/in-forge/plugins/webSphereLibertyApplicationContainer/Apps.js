/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Apps({ snapshot }) {
  const apps = snapshot.getIn(['data', 'applications'], emptyMap).toOrderedMap();
  if (apps.size === 0) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          {t('in-forge:plugins.webSphereLibertyAppContainer.headerApplicationStates')}
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {apps
              .map((appData, appName) => (
                <DescriptionItem key={appName} title={appName}>
                  {appData.get('state')}
                </DescriptionItem>
              ))
              .valueSeq()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
