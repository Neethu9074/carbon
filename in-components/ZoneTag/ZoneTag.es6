

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getColor, getZone} from 'in-sdk/zones';

import './ZoneTag.less';

const rpt = React.PropTypes;
const block = 'in-zone-tag';

const ZoneTag = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    className: rpt.string
  },

  render() {
    const zone = getZone(this.props.snapshot);
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div className={classes}
           style={{background: getColor(zone)}}>
        {zone}
      </div>
    );
  }
});

export default ZoneTag;
