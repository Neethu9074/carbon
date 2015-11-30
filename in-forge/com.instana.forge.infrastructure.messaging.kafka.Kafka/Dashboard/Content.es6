import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

const rpt = React.PropTypes;

const KafkaDashboard = React.createClass({
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

export default KafkaDashboard;
