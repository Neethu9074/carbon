import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClasspathLayouter from 'in-sdk/components/sidebar/ClassPathLayouter';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {emptyList} from 'in-services/fixedImmutables';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';


export default function JettyWebApps({snapshot}) {
  const data = snapshot.get('data');
  const webApps = data.get('webApps', emptyList);

  return (
    <div>
      {webApps.map(webApp =>
        <Collapsible initiallyOpen={false} key={webApp.get('displayName')}>
          <Collapsible.Header>Web App[{webApp.get('displayName')}]</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title='Context Path'>
                {webApp.get('contextPath')}
              </DescriptionItem>
              <DescriptionItem title='State'>
                {webApp.get('state')}
              </DescriptionItem>
              <DescriptionItem title='Session Timeout'>
                {data.get('webAppsSessionData.' + webApp.get('displayName') + '.sessionTimeout')}
              </DescriptionItem>
              <DescriptionItem title='War File Path'>
                {webApp.get('warFile')}
              </DescriptionItem>
              <DescriptionItem title='Temporary Directory'>
                {webApp.get('tempDirectory')}
              </DescriptionItem>
              <DescriptionItem title='Classpath'>
                <ClasspathLayouter classpath={webApp.get('classPath')}/>
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}
    </div>
  );
}

JettyWebApps.propTypes = {
  snapshot: irpt.map.isRequired
};
