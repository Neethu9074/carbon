import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import KPIList from 'in-components/KPIList';


export default React.createClass({
  displayName: 'dummyKPI',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <KPIList snapshot={this.props.snapshot}
               kpis={[
                 'errors',
                 'latency',
                 'calls',
                 'sessions'
               ]}/>
    );
  }
});
