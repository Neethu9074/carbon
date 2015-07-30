'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Panel from 'in-components/Panel';
import MongoDBInfo from '../MongoDBInfo';

const rpt = React.PropTypes;
const MongoDBSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Panel title='MongoDB'>
          <MongoDBInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default MongoDBSidebar;
