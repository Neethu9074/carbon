'use strict';

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
    return (
      <div className={block}>

      </div>
    );
  }
});

export default ZoneTag;
