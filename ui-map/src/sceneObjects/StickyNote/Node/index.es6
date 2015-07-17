'use strict';

import React from 'react/addons';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import NodeIcon from '../NodeIcon';
import StickyNote from '../StickyNote';
import TagFrame from '../TagFrame';
import {iconSize} from '../../../stores/mapStore';

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
    tags: rpt.any.isRequired
  },

  getInitialState() {
    return {size: 50};
  },

  componentDidMount() {
    this.addSubscription(iconSize.subscribe(size => this.setState({size})));
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
            null :
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

    this.tags = parent.snapshot.get('tags') || [];
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
