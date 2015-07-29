'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const ElasticsearchInfo = React.createClass({
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
          {data.get('cluster.name')}
        </DescriptionItem>

        <DescriptionItem title='Node'>
          {data.get('node.name')}
        </DescriptionItem>

        <DescriptionItem title='Node Type'>
          {data.get('node.type')}
        </DescriptionItem>

        <DescriptionItem title='Transport'>
          {data.get('transport')}
        </DescriptionItem>

        <DescriptionItem title='Log Directory'>
          {data.get('log.dir')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default ElasticsearchInfo;
