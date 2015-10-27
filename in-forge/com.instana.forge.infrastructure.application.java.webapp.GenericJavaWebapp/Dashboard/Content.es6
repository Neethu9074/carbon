import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

const rpt = React.PropTypes;

const GenericJavaWebAppDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div></div>
    );
  }

});

export default GenericJavaWebAppDashboard;
