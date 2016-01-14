import moment from 'moment';
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const DockerInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    var createdMillis = data.get('Created');
    // for compatibiltiy with pre 1.1.5 sensor multiply seconds to get ms.
    if (createdMillis < 1500000000) {
      createdMillis *= 1000;
    }

    return (
      <DescriptionList>
        <DescriptionItem title='Image'>
          {data.get('Image')}
        </DescriptionItem>
        <DescriptionItem title='Command'>
          {data.get('Command')}
        </DescriptionItem>
        <DescriptionItem title='Created'>
          {moment(createdMillis).format()}
        </DescriptionItem>
        <DescriptionItem title='Id'>
          {data.get('Id').substring(0, 20)}{'…'}
        </DescriptionItem>
        <DescriptionItem title='Names'>
          {data.get('Names').join(', ')}
        </DescriptionItem>
        <DescriptionItem title='Ports'>
          {this.renderPorts(data)}
        </DescriptionItem>
        <DescriptionItem title='Network Mode'>
          {data.get('NetworkMode')}
        </DescriptionItem>
        <DescriptionItem title='Storage Driver'>
          {data.get('StorageDriver')}
        </DescriptionItem>
        <DescriptionItem title='Docker Version'>
          {data.get('docker_version')}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  renderPorts(data) {
    const ports = data.get('Ports');
    // PortBindings is new as of 1.1.5, Ports for compatibility
    const portBindings = data.get('PortBindings');

    if ((ports == null || ports.size === 0)
        && (portBindings == null || portBindings.size === 0)) {
      return null;
    }

    return (
      <span>
        {ports ? ports.map(port =>
          <span key={port}>{port.get('PrivatePort')}/{port.get('Type')}</span>
        ) : null}
        {portBindings ? portBindings.map(portBinding =>
          <span key={portBinding}>{portBinding}</span>
        ) : null}
      </span>
    );
  }
});

export default DockerInfo;
