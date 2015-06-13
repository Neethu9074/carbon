'use strict';

import React from 'react/addons';

import OSDetailPaneSidebar from './forge/OSDetailPaneSidebar';

import './DetailPaneSidebar.less';

const block = 'in-detail-panel__sidebar';

const DetailPaneSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div className={block}>
        <OSDetailPaneSidebar snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default DetailPaneSidebar;
