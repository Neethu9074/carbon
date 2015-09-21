import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import {iconSize} from '../../../mapStores';
import StickyNote from '../StickyNote';
import NodeIcon from '../NodeIcon';
import TagFrame from '../TagFrame';

import './Node.less';

const rpt = React.PropTypes;

const NodeStickyNoteRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    sceneObject: rpt.object.isRequired,
    snapshot: rpt.object.isRequired,
    showMetric: rpt.bool,
    tags: rpt.object
  },

  getInitialState() {
    return {size: 50};
  },

  componentDidMount() {
    this.addSubscription(iconSize.subscribe(size => this.setState({size})));
  },

  render() {
    const sceneObject = this.props.sceneObject;
    const snapshot = this.props.snapshot;
    const tags = this.props.tags;

    return (
      <div className='in-sticky-note__node-stack-wrapper'>
        <div className='in-sticky-note__node-stack-children'>
          {tags ? <TagFrame tags={tags} sceneObject={sceneObject}/> : null}
          {this.props.showMetric ?
            null :
            <NodeIcon snapshot={snapshot} />
          }
        </div>
      </div>
    );
  }
});


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__node'});

    this.render();
  }

  render() {
    const snapshot = this.parent.snapshot;

    React.render(
      <NodeStickyNoteRC snapshot={snapshot}
                    sceneObject={this.parent}
                    showMetric={this.showMetric}
                    tags={snapshot.get('tags')}/>,
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
