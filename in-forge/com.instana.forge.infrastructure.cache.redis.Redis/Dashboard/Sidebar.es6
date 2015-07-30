'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Panel from 'in-components/Panel';
import RedisInfo from '../RedisInfo';

const rpt = React.PropTypes;
const RedisSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Panel title='Redis'>
          <RedisInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default RedisSidebar;
