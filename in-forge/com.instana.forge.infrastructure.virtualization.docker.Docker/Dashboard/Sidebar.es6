import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';

import DockerLabels from '../DockerLabels';
import DockerInfo from '../DockerInfo';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
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
