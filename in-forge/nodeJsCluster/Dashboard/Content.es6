import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'NodejsClusterDashboard',
  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    return <div/>;
  }
});
