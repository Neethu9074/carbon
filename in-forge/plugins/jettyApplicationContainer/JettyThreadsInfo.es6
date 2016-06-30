import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';

const JettyThreadsInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const minThreads = data.get('minThreads');
    if (!minThreads) {
      return null;
    }
    return (
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Queued Thread Pool</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title='Min Threads'>
              {minThreads}
            </DescriptionItem>
            <DescriptionItem title='Max Threads'>
              {data.get('maxThreads')}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
});

export default JettyThreadsInfo;
