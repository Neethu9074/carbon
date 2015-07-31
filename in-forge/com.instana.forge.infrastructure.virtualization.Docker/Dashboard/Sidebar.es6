'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';
import DockerInfo from '../DockerInfo';
import DockerLabels from '../DockerLabels';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    const labels = this.props.snapshot.getIn(['data', 'Labels']);
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Docker Container</Collapsible.Header>
          <Collapsible.Content>
            <DockerInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        {labels != null && labels.size > 0 ?
          <Collapsible initiallyOpen={true}>
            <Collapsible.Header>Container Labels</Collapsible.Header>
            <Collapsible.Content>
              <DockerLabels snapshot={this.props.snapshot} />
            </Collapsible.Content>
          </Collapsible>
        : null}

        <ProblemPanel snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
