'use strict';


import React from 'react/addons';
import {formatBytes} from 'instana-ui-services/converters';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';

import './index.less';

const StickyNote = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    const numProcesses = this.props.numProcesses;
    const style = {height: this.props.height};
    const component = (
      <div className='in-sticky-note-process__container' style={style}>
        <div className='in-sticky-note-process__content'>
           -- {numProcesses} {((numProcesses > 1) ? 'processes' : 'process')}
        </div>
      </div>
    );

    return component;
  }
});

export default StickyNote;
