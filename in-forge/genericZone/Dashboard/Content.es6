import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

const rpt = React.PropTypes;

const GenericZoneDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.object.isRequired
  },

  render() {
    return (
      null
    );
  }
});

export default GenericZoneDashboard;
