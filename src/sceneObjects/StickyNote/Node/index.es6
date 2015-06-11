'use strict';

import React from 'react/addons';
import {formatBytes} from 'instana-ui-services/converters';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';
import StickyNote from '../StickyNote';
import {createLogger} from 'instalog';

import './index.less';

const logger = createLogger('ui-map.stickyNote.Node.index');
const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    let formattedBytes;
    let jsxStructure;
    try {
      jsxStructure = (
        <div>
          <div className="in-sticky-note__line"></div>
          <div className="in-sticky-after_line">
            <div className="in-sticky-note__content">
              <h2 className="in-sticky-note__node-id">
                {this.props.snapshot.get('hostId')}
              </h2>
              <p className="in-sticky-note__details">
                {data.get('os.name')} {data.get('os.version')}<br/>
                {data.get('cpu.count')}x {data.get('cpu.model')}<br/>
                {formatBytes(data.get('memory.total'))}
              </p>
            </div>
          </div>
        </div>
      );

    } catch(err) {
      logger.error('there are missing properties inside the snapshot that ' +
      'avoid rendering correct sticky note');

      jsxStructure = (<div></div>);

    } finally {
      return jsxStructure;
    }
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note'});
    this.updateWorldPos();
    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
