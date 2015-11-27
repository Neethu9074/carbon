import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'NodejsClusterDashboard',
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    return <div/>;
  }
});
