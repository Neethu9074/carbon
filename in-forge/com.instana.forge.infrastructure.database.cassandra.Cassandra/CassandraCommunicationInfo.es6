

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const CassandraCommunicationInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Node Status'>
          {data.get('mode')} //fehlt
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
