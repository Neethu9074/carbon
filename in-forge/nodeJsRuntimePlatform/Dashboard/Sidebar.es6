import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import DeployedUnitList from 'in-components/DeployedUnitList';
import Collapsible from 'in-components/Collapsible';

import NodeJsInfo from '../NodeJsInfo';

const NodejsDashboardSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Node.js Runtime</Collapsible.Header>
          <Collapsible.Content>
            <NodeJsInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <DeployedUnitList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default NodejsDashboardSidebar;
