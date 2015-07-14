'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from '../../sdk/DescriptionList';

const ProcessInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Command'>
          {data.get('exec')}{' '}
          {data.get('args')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default ProcessInfo;
