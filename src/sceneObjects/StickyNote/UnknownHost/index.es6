'use strict';

import React from 'react/addons';
import StickyNote from '../StickyNote';
import {createLogger} from 'instalog';

import './index.less';

const logger = createLogger('ui-map.stickyNote.UnknownHost.index');
const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    let formattedBytes;
    let jsxStructure = (<div></div>);
    try {
      jsxStructure = (
        <div className="in-sticky-note__host_id">
          {snapshot.get('steadyId')}
        </div>
      );
    } catch(err) {
      logger.error('there are missing properties inside the snapshot that ' +
      'avoid rendering correct sticky note');
    } finally {
      return jsxStructure;
    }
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteUnknownHost extends StickyNote {
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

    worldPos.y = cube.scale.y;
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
