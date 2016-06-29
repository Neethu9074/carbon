import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const JettyThreadsInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Min Threads'>
          {data.get('minThreads')}
        </DescriptionItem>
        <DescriptionItem title='Max Threads'>
          {data.get('maxThreads')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default JettyThreadsInfo;
