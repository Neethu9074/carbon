import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import InterfaceList from '../InterfaceList';
import HostHardware from '../HostHardware';
import HostInfo from '../HostInfo';

const Sidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>System</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Interfaces</Collapsible.Header>
          <Collapsible.Content>
            <InterfaceList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <HostHardware snapshotId={snapshot.get('id')} />
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default Sidebar;
