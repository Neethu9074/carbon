import irpt from 'react-immutable-proptypes';
import React from 'react/addons';


const rpt = React.PropTypes;

const MySqlDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
      </div>
    );
  }
});

export default MySqlDashboard;
