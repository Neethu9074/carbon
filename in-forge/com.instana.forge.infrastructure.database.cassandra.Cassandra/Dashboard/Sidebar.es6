import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';

import CassandraTopologyInfo from '../CassandraTopologyInfo';
import CassandraCommunicationInfo from '../CassandraCommunicationInfo';

const CassandraSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Topology</Collapsible.Header>
          <Collapsible.Content>
            <CassandraTopologyInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Communication</Collapsible.Header>
          <Collapsible.Content>
            <CassandraCommunicationInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

      </div>
    );
  }

});

export default CassandraSidebar;
