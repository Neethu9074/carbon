import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import TagListSnapshot from 'in-components/TagListSnapshot';
import {formatBytes} from 'in-services/converters';

const HardwareInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');

    return (
      <div>
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

        <TagListSnapshot snapshot={snapshot} />
      </div>
    );
  }
});

export default HardwareInfo;
