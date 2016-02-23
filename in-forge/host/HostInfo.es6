import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import TagListSnapshot from 'in-components/TagListSnapshot';
import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';

const HardwareInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');

    const memoryTotal = snapshot.getIn(['data', 'memory.total'], null);
    const swapTotal = snapshot.getIn(['data', 'swap.total'], null);

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

          {memoryTotal !== null ?
            <DescriptionItem title='Memory'>
              {bytesTwoDecimalPlaces(data.get('memory.total'))}
            </DescriptionItem>
          : null}

          {swapTotal !== null ?
            <DescriptionItem title='Swap Total'>
              {bytesTwoDecimalPlaces(data.get('swap.total'))}
            </DescriptionItem>
          : null}

          <DescriptionItem title='FQDN'>
            {data.get('fqdn')}
          </DescriptionItem>
        </DescriptionList>

        <TagListSnapshot snapshot={snapshot} />
      </div>
    );
  }
});

export default HardwareInfo;
