'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from '../../sdk/DescriptionList';

const CassandraInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>

        <DescriptionItem title='Cluster'>
          {data.get('clusterName')}
        </DescriptionItem>

        <DescriptionItem title='Host'>
          {data.get('hostId')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default CassandraInfo;
