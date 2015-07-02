'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import './Details.less';

const block = 'in-sidebar-server-details';

const Details = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        {this.props.snapshot.get('steadyId')}
      </div>
    );
  }
});

export default Details;
