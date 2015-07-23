'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'instana-ui-components/Collapsible';

import MongoDBInfo from '../MongoDBInfo';
import ProblemPanel from 'instana-ui-components/ProblemPanel';

import './Details.less';

const block = 'in-sidebar-server-details';

const Details = React.createClass({
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

export default Details;
