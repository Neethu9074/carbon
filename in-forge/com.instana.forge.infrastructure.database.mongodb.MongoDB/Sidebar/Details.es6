import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import WiringList from 'in-components/WiringList';
import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';

import MongoDBInfo from '../MongoDBInfo';

const block = 'in-sidebar-server-details';

const MongoDBDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Host</Collapsible.Header>
          <Collapsible.Content>
            <MongoDBInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default MongoDBDetails;
