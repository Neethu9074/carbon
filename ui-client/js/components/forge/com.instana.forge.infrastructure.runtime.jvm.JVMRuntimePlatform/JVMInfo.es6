'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from '../../sdk/DescriptionList';

const JVMInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Java Version'>
          {data.get('jvm.version')}{'.'}
          {data.get('jvm.build')}
        </DescriptionItem>

        <DescriptionItem title='Java Runtime'>
          {data.get('jvm.vendor')}{' '}
          {data.get('jvm.name')}
        </DescriptionItem>

        <DescriptionItem title='Xmx'>
          {data.get('memory.max')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default JVMInfo;
