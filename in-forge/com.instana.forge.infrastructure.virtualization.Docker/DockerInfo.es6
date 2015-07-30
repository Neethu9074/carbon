'use strict';

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
          {data.get('Id').substring(0, 12)}{'...'}
        </DescriptionItem>
        <DescriptionItem title='Names'>
          {data.get('Names')}
        </DescriptionItem>
        <DescriptionItem title='Labels'>
          {data.get('Labels')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default DockerInfo;
