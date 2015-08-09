

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';

import DockerInfo from '../DockerInfo';
import DockerLabels from '../DockerLabels';
import ProblemPanel from 'in-components/ProblemPanel';

const block = 'in-sidebar-server-details';

const Details = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    const labels = data.get('Labels');

    return (
      <div className={block}>
        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Container Information</Collapsible.Header>
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
      </div>
    );
  }
});

export default Details;
