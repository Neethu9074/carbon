import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';

import MultiTagToolTip from '../../Tooltips/MultiTag';
import Tag from './Tag';

import './index.less';


export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    sceneObject: React.PropTypes.object.isRequired,
    tags: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {zoomLevel: level.near};
  },

  componentDidMount() {
    this.addSubscription(zoomLevel.subscribe(l => {
      this.setState({zoomLevel: l});
    }));
  },

  mouseOver: function () {
    this.tooltip = new MultiTagToolTip({
      parent: this.props.sceneObject,
      tags: this.props.tags
    });
    this.tooltip.mount();
  },

  mouseOut: function () {
    this.tooltip.unMount();
    this.tooltip = null;
  },

  render() {
    if(this.props.tags.size === 0) {
      return null;
    }

    const zoom = this.state.zoomLevel;
    let content = null;

    if(zoom === level.near || zoom === level.nearest) {
      content = (
        <ul className='in-tooltip__tag-frame--ul'>
          {this.props.tags.map((tag) => {
            return (
              <li key={tag} className='in-tooltip__tag-frame--li'>
                <Tag tag={tag} sceneObject={this.props.sceneObject}/>
              </li>
            );
          })}
        </ul>
      );

    } else {
      content = (
        <div className='in-tooltip__tag-frame--bubble'
          onMouseOver={this.mouseOver}
          onMouseOut={this.mouseOut}>
        </div>
      );
    }

    // const l = this.props.tags.length;
    return (
      <div className='in-sticky-note__tag-frame'>
        {content}
      </div>
    );
  }
});
