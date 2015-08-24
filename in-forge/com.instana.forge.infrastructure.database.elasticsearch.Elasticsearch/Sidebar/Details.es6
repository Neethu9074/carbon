import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import WiringList from 'in-components/WiringList';
import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';

import ElasticsearchInfo from '../ElasticsearchInfo';

const block = 'in-sidebar-server-details';

const ElasticsearchDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Node</Collapsible.Header>
          <Collapsible.Content>
            <ElasticsearchInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default ElasticsearchDetails;
