'use strict';

import React from 'react/addons';

import {formatBytes} from 'instana-ui-services/converters';
import {DescriptionList, DescriptionItem} from '../../sdk/DescriptionList';

const HardwareInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='OS'>
          {data.get('os.name')}{' '}
          {data.get('os.arch')}{' '}
          {data.get('os.version')}
        </DescriptionItem>

        <DescriptionItem title='CPU'>
          {data.get('cpu.count')} x {data.get('cpu.model')}
        </DescriptionItem>

        <DescriptionItem title='Memory'>
          {formatBytes(data.get('memory.total'))}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default HardwareInfo;
