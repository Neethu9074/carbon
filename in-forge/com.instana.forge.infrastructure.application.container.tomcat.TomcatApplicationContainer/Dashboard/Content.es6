

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

const rpt = React.PropTypes;

const TomcatDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
      </div>
    );
  }

});

export default TomcatDashboard;
