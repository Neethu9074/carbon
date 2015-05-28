'use strict';


import React from 'react/addons';
import {formatBytes} from 'instana-ui-services/converters';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';

import StickyNote from '../StickyNote';

import './index.less';

const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    return (
      <div>
        <div className="in-sticky-note__line"></div>
        <div className="in-sticky-after_line">
          <SnapshotIcon className="in-sticky-note__host-icon"
                        snapshot={this.props.snapshot}/>
          <div className="in-sticky-note__content">
            <h2 className="in-sticky-note__host-id">
              {data.get('hostname')}
            </h2>
            <p className="in-sticky-note__details">
              {data.get('os.name')} {data.get('os.version')}<br/>
              {data.get('cpu.count')}x{data.get('cpu.model')}<br/>
              {formatBytes(data.get('memory.total'))}
            </p>
          </div>
        </div>
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteHost extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note'});
    this.updateWorldPos();
    this.render();
  }

  updateWorldPos() {
    const cube = this.parent.cube;
    const worldPos = this.stickyNoteEndPosWorld;
    worldPos.set(-0.5, 0, 0.5);
    worldPos.applyMatrix4(cube.matrixWorld);

    //worldPos.x -= stickyNoteLineEndLocalPosition.x;
    worldPos.y = cube.scale.y; //+ stickyNoteLineEndLocalPosition.y;
    //worldPos.z += niceLookingDistanceForSticky.z + 0.5;
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
