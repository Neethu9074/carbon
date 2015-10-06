import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';
import WiringList from 'in-components/WiringList';

import NodeJsInfo from '../NodeJsInfo';

const block = 'in-sidebar-server-details';

const NodeJsMapSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Node.js</Collapsible.Header>
          <Collapsible.Content>
            <NodeJsInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default NodeJsMapSidebar;
