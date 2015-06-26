'use strict';

import React from 'react/addons';
import {getIcon} from 'instana-ui-sdk/snapshot';

import './index.less';

const rpt = React.PropTypes;

export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    const icon = getIcon(this.props.snapshot);

    return (
      <div className="in-sticky-note__icon">
        <div className='in-sticky-note__icon-background'>
          {icon ?
            <img src={icon} className='in-sticky-note__icon-svg'/> : null}
        </div>
      </div>
    );
  }
});
