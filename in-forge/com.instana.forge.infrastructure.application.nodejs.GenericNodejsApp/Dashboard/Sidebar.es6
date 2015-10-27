import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';
import DeployedUnitList from 'in-components/DeployedUnitList';
import TagListSnapshot from 'in-components/TagListSnapshot';

import NodeJsAppInfo from '../NodeJsAppInfo';

const NodejsDashboardSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Node.js Application</Collapsible.Header>
          <Collapsible.Content>
            <NodeJsAppInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <TagListSnapshot snapshot={this.props.snapshot} />
        <DeployedUnitList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default NodejsDashboardSidebar;
