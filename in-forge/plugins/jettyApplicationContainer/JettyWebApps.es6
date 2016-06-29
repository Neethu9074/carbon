import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

import ClasspathLayouter from 'in-forge/plugins/jvmRuntimePlatform/ClasspathLayouter.es6';

import {emptyList} from 'in-services/fixedImmutables';

const JettyWebApps = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
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
              </DescriptionList>
              <ClasspathLayouter classpath={webApp.get('classPath')}/>
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  }

});

export default JettyWebApps;
