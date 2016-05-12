import irpt from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import MetricValue from 'in-components/MetricValue';

import {
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';

import './ClusterSummary.less';

const block = 'in-es-cluster-summary';

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
          <td className={block + '-name'}><span>{data.get('groupId')}</span></td>
          <td className={block + '-cell'}>
            <span className={block + '-heading'}>Nodes</span>
                  <br/>
                  <MetricValue snapshotId={snapshotId}
                               metric='node_count'
                               formatter={withSiPrefixZeroDecimalPlaces}
                               className={block + '-value'}/>
          </td>
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
                         metric='active_shards_count'
                         formatter={withSiPrefixZeroDecimalPlaces}
                         className={block + '-value'}/>
          </td>
          <td className={block + '-cell'}>
            <span className={block + '-heading'}>Documents</span>
            <br/>
            <MetricValue snapshotId={snapshotId}
                         metric='document_count'
                         formatter={withSiPrefixThreeDecimalPlaces}
                         className={block + '-value'}/>
          </td>
          <td className={block + '-cell'}>
            <span className={block + '-heading'}>Size of Store</span>
            <br/>
            <MetricValue snapshotId={snapshotId}
                         metric='store_size'
                         formatter={withSiPrefixThreeDecimalPlaces}
                         className={block + '-value'}/>
          </td>
        </tr>
      </table>
    );
  }});
