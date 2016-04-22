import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const RabbitMqInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='PID'>
          {data.get('pid')}
        </DescriptionItem>
        <DescriptionItem title='Port'>
          {data.get('port')}
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
          {data.get('nodes').length}
        </DescriptionItem>
        <DescriptionItem title='Queues'>
          {data.get('queues').length}
        </DescriptionItem>
        <DescriptionItem title='Channels'>
          {data.get('channels').length}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default RabbitMqInfo;
