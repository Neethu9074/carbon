import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import StickyNote from '../StickyNote';
import TagFrame from '../TagFrame';

import './Node.less';

const rpt = React.PropTypes;

const NodeStickyNoteRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: rpt.object.isRequired,
    showMetric: rpt.bool
  },

  render() {
    const tags = this.props.snapshot.get('tags');

    return (
      <div className='in-sticky-note__node-stack-wrapper'>
        <div className='in-sticky-note__node-stack-children'>
          {tags ? <TagFrame tags={tags}/> : null}
        </div>
      </div>
    );
  }
});


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__node'});

    this.showMetric = false;
    this.render();
  }

  render() {
    const snapshot = this.parent.snapshot;

    React.render(
      <NodeStickyNoteRC snapshot={snapshot}
                        showMetric={this.showMetric}/>,
      this.stickyNoteContainer
    );
  }

  onSnapshotUpdate() {
    this.render();
  }

  switchToMetric() {
    this.showMetric = true;
    this.render();
  }

  switchToIcon() {
    this.showMetric = false;
    this.render();
  }
}
