import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {
  formatUnixDateTime
}from 'in-forge/plugins/redis/formatters/date';

import {
  formatBoolean
}from 'in-forge/plugins/redis/formatters/boolean';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import MetricValue from 'in-components/MetricValue';

const secondsFormatter = d => {
    return d + 's';
};
const secondsAgoFormatter = d => {
    return d + 's ago';
};
const syncInProgressFormatter = d => {
    return formatBoolean(d > 0);
};

const RedisInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const snapshotId = this.props.snapshot.get('id');
    const role = data.get('role');
    const masterLinkStatus = data.get('master_link_status');

    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title='Port'>
          {data.get('port')}
        </DescriptionItem>
        <DescriptionItem title='Started At'>
            {formatUnixDateTime(data.get('started_at'))}
        </DescriptionItem>
        <DescriptionItem title='Role'>
            {role}
        </DescriptionItem>
        <DescriptionItem title='Cluster Enabled'>
            {formatBoolean(data.get('cluster_enabled') === 1)}
        </DescriptionItem>
        {role === 'master' ?
          <DescriptionItem title='Number of Slaves'>
            <MetricValue metric={'master_connected_slaves'}
                         snapshotId={snapshotId} />
          </DescriptionItem>
        : null}
        {role === 'slave' ?
          <DescriptionItem title='Master Host'>
            {data.get('master_host')}
          </DescriptionItem>
        : null}
        {role === 'slave' ?
          <DescriptionItem title='Master Port'>
            {data.get('master_port')}
          </DescriptionItem>
        : null}
        {role === 'slave' ?
          <DescriptionItem title='Master Link Status'>
            {masterLinkStatus}
          </DescriptionItem>
        : null}
        {masterLinkStatus === 'down' && role === 'slave' ?
          <DescriptionItem title='Master Downtime'>
            <MetricValue metric={'master_downtime_seconds'}
                         snapshotId={snapshotId}
                         formatter={secondsFormatter}/>
          </DescriptionItem>
        : null}
        {role === 'slave' ?
          <DescriptionItem title='Sync in Progress'>
            <MetricValue metric={'master_sync_left_bytes'}
                         snapshotId={snapshotId}
                         formatter={syncInProgressFormatter}/>
          </DescriptionItem>
        : null}
        {role === 'slave' ?
          <DescriptionItem title='Last Interaction with Master'>
            <MetricValue metric={'master_last_io_seconds_ago'}
                         snapshotId={snapshotId}
                         formatter={secondsAgoFormatter}/>
          </DescriptionItem>
        : null}
      </DescriptionList>
    );
  }
});

export default RedisInfo;
