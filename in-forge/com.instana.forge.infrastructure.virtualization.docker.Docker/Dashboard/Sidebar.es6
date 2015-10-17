import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import WiringList from 'in-components/WiringList';

import DockerLabels from '../DockerLabels';
import DockerInfo from '../DockerInfo';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
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

        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
