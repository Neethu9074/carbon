import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

const rpt = React.PropTypes;

export default React.createClass({
    displayName: 'AvailabilityZoneDashboard',
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
      snapshot: irpt.map.isRequired,
      timeframe: rpt.number.isRequired
    },

    render() {
      return <div>TODO</div>;
    }

});
