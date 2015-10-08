import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import TagList from 'in-components/TagList/TagList';
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

        <TagList snapshot={snapshot} />
      </div>
    );
  }
});

export default HardwareInfo;
