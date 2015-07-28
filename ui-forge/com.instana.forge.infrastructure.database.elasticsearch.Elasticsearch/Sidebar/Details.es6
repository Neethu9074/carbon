'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'instana-ui-components/Collapsible';

import ElasticsearchInfo from '../ElasticsearchInfo';
import ProblemPanel from 'instana-ui-components/ProblemPanel';

const block = 'in-sidebar-server-details';

const ElasticsearchDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <div className={block}>
        {data.get('cluster.name')}

        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Node</Collapsible.Header>
          <Collapsible.Content>
            <ElasticsearchInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default ElasticsearchDetails;
