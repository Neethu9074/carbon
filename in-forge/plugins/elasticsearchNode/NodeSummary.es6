import irpt from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import MetricValue from 'in-components/MetricValue';

import {
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';

import './NodeSummary.less';

const block = 'in-es-node-summary';

export default React.createClass({

  displayName: '',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {

    const data = this.props.snapshot.get('data');
    const snapshotId = this.props.snapshot.get('id');

    return (
      <table>
        <tr>
          <td className={block + '-name'}><span>{data.get('node.name')}</span></td>
          <td  className={block + '-cell'}>
            <span className={block + '-heading'}>Indices</span>
            <br/>
            <MetricValue snapshotId={snapshotId}
                         metric='indices_count'
                         formatter={withSiPrefixZeroDecimalPlaces}
                         className={block + '-value'}/>
          </td>
          <td className={block + '-cell'}>
            <span className={block + '-heading'}>Active Shards</span>
            <br/>
            <MetricValue snapshotId={snapshotId}
                         metric='shards.node_active_shards'
                         formatter={withSiPrefixZeroDecimalPlaces}
                         className={block + '-value'}/>
          </td>
          <td className={block + '-cell'}>
            <span className={block + '-heading'}>Documents</span>
            <br/>
            <MetricValue snapshotId={snapshotId}
                         metric='indices.document_count'
                         formatter={withSiPrefixThreeDecimalPlaces}
                         className={block + '-value'}/>
          </td>
          <td className={block + '-cell'}>
            <span className={block + '-heading'}>Size of Store</span>
            <br/>
            <MetricValue snapshotId={snapshotId}
                         metric='indices.store_size'
                         formatter={withSiPrefixThreeDecimalPlaces}
                         className={block + '-value'}/>
          </td>
        </tr>
      </table>
    );
  }});
