import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';
import TagList from 'in-components/TagList/TagList';
import WiringList from 'in-components/WiringList';

import HostInfo from '../HostInfo';
import HostHardware from '../HostHardware';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>System</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <TagList snapshot={this.props.snapshot} />
        <HostHardware snapshot={this.props.snapshot} />
        <ProblemPanel snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
