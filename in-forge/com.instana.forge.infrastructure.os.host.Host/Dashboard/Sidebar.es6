import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import WiringList from 'in-components/WiringList';

import HostHardware from '../HostHardware';
import InterfaceList from '../InterfaceList';
import HostInfo from '../HostInfo';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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

        <HostHardware snapshot={snapshot} />
        <WiringList snapshot={snapshot} />
      </div>
    );
  }

});

export default Sidebar;
