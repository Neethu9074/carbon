'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

const rpt = React.PropTypes;
const block = 'in-sidebar-severity-listing';

const SeverityListing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshotIssueSummary: irpt.map.isRequired,
    snapshots: irpt.list.isRequired,
    heading: rpt.string.isRequired
  },

  render() {
    return (
      <div className={block}>
        <h2>{this.props.heading}</h2>


      </div>
    );
  }
});

export default SeverityListing;
