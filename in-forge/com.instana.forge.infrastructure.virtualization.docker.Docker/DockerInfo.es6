

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

    return (
      <DescriptionList>
        <DescriptionItem title='Image'>
          {data.get('Image')}
        </DescriptionItem>
        <DescriptionItem title='Command'>
          {data.get('Command')}
        </DescriptionItem>
        <DescriptionItem title='Id'>
          {data.get('Id').substring(0, 24)}{'…'}
        </DescriptionItem>
        <DescriptionItem title='Names'>
          {data.get('Names').join(', ')}
        </DescriptionItem>
        <DescriptionItem title='Ports'>
          {this.renderPorts(data)}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  renderPorts(data) {
    const ports = data.get('Ports');
    if (ports == null || ports.size === 0) {
      return null;
    }

    return (
      <span>
        {ports.map(port =>
          <span key={port}>{port.get('PrivatePort')}/{port.get('Type')}</span>
        )}
      </span>
    );
  }
});

export default DockerInfo;
