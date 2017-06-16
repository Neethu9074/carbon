import React from 'react';

import ClasspathLayouter from 'in-sdk/components/sidebar/ClassPathLayouter';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';

export default function JettyWebApps({ snapshot }) {
  const data = snapshot.get('data');
  const webApps = data.get('webApps', emptyList).sortBy(webApp => webApp.get('displayName'));
  if (webApps.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Web Apps</Collapsible.Header>
        <Collapsible.Content>
          {webApps.map((webApp, i) =>
            <Collapsible initiallyOpen={false} key={i}>
              <Collapsible.Header>{webApp.get('displayName') || '<unnamed>'}</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  <DescriptionItem title="Context Path">
                    {webApp.get('contextPath')}
                  </DescriptionItem>
                  <DescriptionItem title="State">
                    {webApp.get('state')}
                  </DescriptionItem>
                  <DescriptionItem title="Session Timeout">
                    {data.get('webAppsSessionData.' + webApp.get('displayName') + '.sessionTimeout')}
                  </DescriptionItem>
                  <DescriptionItem title="War File Path">
                    {webApp.get('warFile')}
                  </DescriptionItem>
                  <DescriptionItem title="Temporary Directory">
                    {webApp.get('tempDirectory')}
                  </DescriptionItem>
                  <DescriptionItem title="Classpath">
                    <ClasspathLayouter classpath={webApp.get('classPath')} />
                  </DescriptionItem>
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          )}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
