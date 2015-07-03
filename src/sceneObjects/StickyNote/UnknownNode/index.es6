'use strict';

import React from 'react/addons';
import StickyNote from '../StickyNote';
import {createLogger} from 'instalog';

import './index.less';

const logger = createLogger('ui-map.stickyNote.UnknownNode.index');
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
    let jsxStructure = null;
    try {
      jsxStructure = (
        <div className='in-sticky-note__note__unknown-node--stack-wrapper'>
          <div className='in-sticky-note__note__unknown-node--stack-children'>
            {snapshot.get('steadyId')}
          </div>
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

export default class StickyNoteUnknownNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__unknown-node'});
    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
