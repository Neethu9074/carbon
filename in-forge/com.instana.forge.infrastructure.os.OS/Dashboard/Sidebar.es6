import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
import React from 'react/addons';

import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';
import TagList from 'in-components/TagList/TagList';
import WiringList from 'in-components/WiringList';
import * as constants from 'in-forge/constants';

import EC2Info from '../../com.instana.forge.hardware.virtual.EC2/EC2Info';
import HostInfo from '../HostInfo';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const ec2s = data.getIn([constants.rels.describes, constants.plugins.ec2],
                            Immutable.Map());
    const ec2 = ec2s.valueSeq().first();

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>System</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        {ec2 ?
          <Collapsible initiallyOpen={true}>
            <Collapsible.Header>Amazon</Collapsible.Header>
            <Collapsible.Content>
              <EC2Info data={ec2} />
            </Collapsible.Content>
          </Collapsible>
        : null}

        <ProblemPanel snapshot={this.props.snapshot} />
        <TagList snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
