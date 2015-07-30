'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Panel from 'in-components/Panel';
import ElasticsearchInfo from '../ElasticsearchInfo';

const rpt = React.PropTypes;
const ElasticsearchSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Panel title='Elasticsearch'>
          <ElasticsearchInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default ElasticsearchSidebar;
