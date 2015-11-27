import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import DeployedUnitList from 'in-components/DeployedUnitList';
import TagListSnapshot from 'in-components/TagListSnapshot';
import Collapsible from 'in-components/Collapsible';

import NodeJsAppInfo from '../NodeJsAppInfo';

const NodejsDashboardSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Node.js Application</Collapsible.Header>
          <Collapsible.Content>
            <NodeJsAppInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <TagListSnapshot snapshot={snapshot} />
        <DeployedUnitList snapshot={snapshot} />
      </div>
    );
  }
});

export default NodejsDashboardSidebar;
