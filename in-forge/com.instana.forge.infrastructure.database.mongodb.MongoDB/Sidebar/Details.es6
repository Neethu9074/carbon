'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';

import MongoDBInfo from '../MongoDBInfo';
import ProblemPanel from 'in-components/ProblemPanel';

const block = 'in-sidebar-server-details';

const MongoDBDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <div className={block}>
        {data.get('version')}

        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Host</Collapsible.Header>
          <Collapsible.Content>
            <MongoDBInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default MongoDBDetails;
