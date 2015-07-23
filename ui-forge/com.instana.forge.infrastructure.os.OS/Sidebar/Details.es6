'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';

import * as constants from 'instana-ui-forge/constants';
import Collapsible from 'instana-ui-components/Collapsible';

import EC2Info from '../../com.instana.forge.infrastructure.virtualization.EC2/EC2Info';
import HostInfo from '../HostInfo';
import ProblemPanel from 'instana-ui-components/ProblemPanel';

const block = 'in-sidebar-server-details';

const OsDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const ec2s = data.getIn([constants.rels.describes, constants.plugins.ec2],
                            Immutable.Map());
    const ec2 = ec2s.valueSeq().first();

    return (
      <div className={block}>
        {data.get('hostname')}

        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Host</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        {ec2 ?
          <Collapsible initiallyOpen={true}>
            <Collapsible.Header>Amazon EC2</Collapsible.Header>
            <Collapsible.Content>
              <EC2Info data={ec2} />
            </Collapsible.Content>
          </Collapsible>
        : null}
      </div>
    );
  }
});

export default OsDetails;
