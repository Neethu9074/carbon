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

  update() {
    const scene = this.parent.getScene();
    const pos = this.stickyNoteEndPosWorld.clone();
    pos.applyMatrix4(scene.camera.projection);

    const x = ((pos.x + 1) * scene.width / 2) | 0;
    const y = ((-pos.y + 1) * scene.height / 2) | 0;
    const translate = `translate3d(${x}px,${y}px,0)`;

    const stickyNoteContainerStyle = this.style;
    stickyNoteContainerStyle.transform = translate;
    stickyNoteContainerStyle['-webkit-transform'] = translate;

    //set to '' because the display is set by zoom too. If you would set
    //this value to another like '' you would overwrite it
    stickyNoteContainerStyle.display = '';
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
