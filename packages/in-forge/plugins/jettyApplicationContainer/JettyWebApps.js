/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import ClasspathLayouter from 'in-sdk/components/sidebar/ClassPathLayouter';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function JettyWebApps({ snapshot }) {
  const data = snapshot.get('data');
  const webApps = data.get('webApps', emptyList).sortBy(webApp => webApp.get('displayName'));
  if (webApps.size === 0) {
    return null;
  }

  return (
    <Collapsible initiallyOpen={false}>
      <Collapsible.Header>{t('in-forge:plugins.jettyApplicationContainer.webApps')}</Collapsible.Header>
      <Collapsible.Content>
        {webApps.map((webApp, i) => (
          <Collapsible initiallyOpen={false} key={i}>
            <Collapsible.Header>{webApp.get('displayName') || '<unnamed>'}</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.contextPath')}>
                  {webApp.get('contextPath')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.state')}>
                  {webApp.get('state')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.sessionTimeout')}>
                  {data.get('webAppsSessionData.' + webApp.get('displayName') + '.sessionTimeout')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.warFilePath')}>
                  {webApp.get('warFile')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.temporaryDirectory')}>
                  {webApp.get('tempDirectory')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.classpath')}>
                  <ClasspathLayouter classpath={webApp.get('classPath')} />
                </DescriptionItem>
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>
        ))}
      </Collapsible.Content>
    </Collapsible>
  );
}
