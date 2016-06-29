import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import JettyInfo from '../JettyInfo.es6';
import JettyThreadsInfo from '../JettyThreadsInfo.es6';
import JettyConnectors from '../JettyConnectors.es6';
import JettyWebApps from '../JettyWebApps.es6';

const JettySidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Jetty Server Info</Collapsible.Header>
          <Collapsible.Content>
            <JettyInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Queued Thread Pool</Collapsible.Header>
          <Collapsible.Content>
            <JettyThreadsInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <JettyConnectors snapshot={snapshot} />
        <JettyWebApps snapshot={snapshot} />
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default JettySidebar;
