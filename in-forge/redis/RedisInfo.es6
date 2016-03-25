import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {
  msZeroDecimalPlaces,
  muSecondsToMillisZeroDecimalPlaces,
  timeByMicroTwoDecimalPlaces
} from 'in-services/formatters/number';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const RedisInfo = React.createClass({
  mixins: [PureRenderMixin],

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
        <DescriptionItem title='Port'>
          {data.get('port')}
        </DescriptionItem>
        {data.get('started_at') > 0 ?
          <DescriptionItem title='Started at'>
              {timeByMicroTwoDecimalPlaces(data.get('started_at'))}
          </DescriptionItem>
        : null}
        <DescriptionItem title='Max Memory'>
            {data.get('max_memory')}
        </DescriptionItem>
        <DescriptionItem title='Role'>
            {data.get('role')}
        </DescriptionItem>
        <DescriptionItem title='Max clients'>
            {data.get('maxclients')}
        </DescriptionItem>
        {data.get('latency_monitor_threshold') != null ?
          <DescriptionItem title='Latency monitor threshold'>
            {msZeroDecimalPlaces(data.get('latency_monitor_threshold'))}
          </DescriptionItem>
        : null}
        {data.get('slow_log_slower_than') != null ?
          <DescriptionItem title='SlowLog slower than'>
            {muSecondsToMillisZeroDecimalPlaces(data.get('slow_log_slower_than'))}
          </DescriptionItem>
        : null}
        <DescriptionItem title='Watchdog period'>
          {data.get('watchdog_period')}
        </DescriptionItem>
        <DescriptionItem title='PUBSUB channels'>
          {data.get('pubsub_channels')}
        </DescriptionItem>
        <DescriptionItem title='Master host'>
          {data.get('master_host')}
        </DescriptionItem>
        <DescriptionItem title='master port'>
          {data.get('master_port')}
        </DescriptionItem>
        <DescriptionItem title='Master link status'>
          {data.get('master_link_status')}
        </DescriptionItem>
        <DescriptionItem title='Master sync left bytes'>
          {data.get('master_sync_left_bytes')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default RedisInfo;
