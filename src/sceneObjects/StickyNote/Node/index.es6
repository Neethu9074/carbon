'use strict';

import React from 'react/addons';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';
import {getIcon} from 'instana-ui-sdk/snapshot';
import StickyNote from '../StickyNote';
import {getHealth} from 'instana-ui-services/issueTracker';
import {health} from 'instana-ui-services/health';
import {
  getProblemsForSnapshot,
  getOpenIssues
} from 'instana-ui-services/issueTracker';

import './index.less';

const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  getHighlightedContent() {
    return '';
  },

  render() {
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const highlightedCode = this.getHighlightedContent();
    const icon = getIcon(snapshot);

    return (
      <div className='in-sticky-note__node'>
        {highlightedCode}
        <div>
          {icon ? <img src={icon} className='in-sticky-note__node__icon'/> : ''}
        </div>
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__node'});
    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot}
                    highlighted={this.highlighted}/>,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
