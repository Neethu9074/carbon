import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {emptyList} from 'in-services/fixedImmutables';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const RabbitMqInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const nodeNames = data.get('nodes', emptyList).toArray();
    const queueNames = data.get('queues', emptyList).toArray();
    const channelNames = data.get('channels', emptyList).toArray();

    return (
      <DescriptionList>
        <DescriptionItem title='PID'>
          {data.get('pid')}
        </DescriptionItem>
        <DescriptionItem title='Ports'>
          {data.get('overview.ports', emptyList).join(', ')}
        </DescriptionItem>
        <DescriptionItem title='Version'>
          {data.get('overview.version')}
        </DescriptionItem>
        <DescriptionItem title='Erlang version'>
          {data.get('overview.erlang_version')}
        </DescriptionItem>
        <DescriptionItem title='Node'>
          {data.get('overview.node')}
        </DescriptionItem>
        <DescriptionItem title='Nodes'>
          {nodeNames.length}
        </DescriptionItem>
        <DescriptionItem title='Queues'>
          {queueNames.length}
        </DescriptionItem>
        <DescriptionItem title='Channels'>
          {channelNames.length}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default RabbitMqInfo;
