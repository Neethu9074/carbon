import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import KeyValuePopup from 'in-components/KeyValuePopup';
import Collapsible from 'in-components/Collapsible';

import NodeJsInfo from '../NodeJsInfo';

const NodejsDashboardSidebar = React.createClass({
  mixins: [PureRenderMixin],

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

        <KeyValuePopup header='Runtime Versions'
                       data={this.props.snapshot.getIn(['data', 'versions'])} />

        <DeployedUnitList snapshotId={this.props.snapshot.get('id')} />
      </div>
    );
  }

});

export default NodejsDashboardSidebar;
