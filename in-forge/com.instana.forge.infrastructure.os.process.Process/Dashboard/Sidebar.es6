import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';
import WiringList from 'in-components/WiringList';

import ArgList from '../ArgList';
import ProcessInfo from '../ProcessInfo';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Process</Collapsible.Header>
          <Collapsible.Content>
            <ProcessInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Arguments</Collapsible.Header>
          <Collapsible.Content>
            <ArgList snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <ProblemPanel snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
