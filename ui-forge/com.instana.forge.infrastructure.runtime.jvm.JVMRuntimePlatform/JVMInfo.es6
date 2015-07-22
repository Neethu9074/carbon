'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'instana-ui-services/converters';
import {DescriptionList, DescriptionItem} from 'instana-ui-components/DescriptionList';

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

        <DescriptionItem title='Maximum Heap'>
          {formatBytes(data.get('memory.max'))}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default JVMInfo;
