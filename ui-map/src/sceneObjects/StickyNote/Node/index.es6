'use strict';

import React from 'react/addons';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import NodeIcon from '../NodeIcon';
import NodeMetric from '../NodeMetric';
import StickyNote from '../StickyNote';
import TagFrame from '../TagFrame';

import './index.less';

const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: rpt.object.isRequired,
    sceneObject: rpt.object.isRequired,
    showMetric: rpt.bool,
    tags: rpt.array.isRequired
  },

  getInitialState() {
    return {size: 50};
  },

  componentDidMount() {

  },

  render() {
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const tags = this.props.tags;
    const sceneObject = this.props.sceneObject;

    return (
      <div className='in-sticky-note__node-stack-wrapper'>
        <div className='in-sticky-note__node-stack-children'>
          {tags ? <TagFrame tags={tags} sceneObject={sceneObject}/> : null}
          {this.props.showMetric ?
            <NodeMetric snapshot={snapshot} /> :
            <NodeIcon snapshot={snapshot} />
          }
        </div>
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__node'});

    this.tags = []; // this.props.tags;
    const numElements = Math.floor(Math.random() * 0);
    for (let i = 0; i < numElements; i++) {
      this.tags.push({label: 'tag_' + i});
    }

    console.log(parent.snapshot.toJS());

    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot}
                    highlighted={this.highlighted}
                    sceneObject={this.parent}
                    showMetric={this.showMetric}
                    tags={this.tags}/>,
      this.stickyNoteContainer
    );
  }

  switchToMetric() {
    this.showMetric = true;
    this.render();
  }

  switchToIcon() {
    this.showMetric = false;
    this.render();
  }

  dispose() {
    super.dispose();
  }
}
