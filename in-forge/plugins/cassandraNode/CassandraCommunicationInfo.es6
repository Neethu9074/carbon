import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const CassandraCommunicationInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Node Status'>
          {data.get('mode')}
        </DescriptionItem>

        <DescriptionItem title='Gossip Running'>
          {data.get('gossipRunning')}
        </DescriptionItem>

        <DescriptionItem title='Thrift Running'>
          {data.get('thriftRunning')}
        </DescriptionItem>

        <DescriptionItem title='CQL/Native Transport Running'>
          {data.get('nativeTransportRunning')}
        </DescriptionItem>

      </DescriptionList>
    );
  }
});

export default CassandraCommunicationInfo;
