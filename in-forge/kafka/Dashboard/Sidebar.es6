import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import KafkaInfo from '../KafkaInfo';

const KafkaSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Kafka</Collapsible.Header>
          <Collapsible.Content>
            <KafkaInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <RunningComponentsList snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default KafkaSidebar;
