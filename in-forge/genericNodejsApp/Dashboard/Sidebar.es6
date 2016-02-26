import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import TagListSnapshot from 'in-components/TagListSnapshot';
import Collapsible from 'in-components/Collapsible';

import NodeJsAppInfo from '../NodeJsAppInfo';

const NodejsDashboardSidebar = React.createClass({
  mixins: [PureRenderMixin],

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
        <DeployedUnitList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default NodejsDashboardSidebar;
