import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

const rpt = React.PropTypes;

const GenericJavaWebAppDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div/>
    );
  }
});

export default GenericJavaWebAppDashboard;
