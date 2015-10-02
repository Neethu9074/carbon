import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';

import MongoDBInfo from '../MongoDBInfo';

const MongoDBSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>MongoDB</Collapsible.Header>
          <Collapsible.Content>
            <MongoDBInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <ProblemPanel snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default MongoDBSidebar;
