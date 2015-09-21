import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import Tooltip from 'in-components/Tooltip';

import TagToolTip from '../../Tooltips/Tag';
import Tag from './Tag';

import './TagFrame.less';

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

  render() {
    if (this.props.tags.size === 0) {
      return null;
    }

    const zoom = this.state.zoomLevel;
    if (zoom === level.near || zoom === level.nearest) {
      return (
        <div className='in-sticky-note__tag-frame'>
          <ul className='in-tooltip__tag-frame--ul'>
            {this.props.tags.map(tag => {
              return (
                <li key={tag} className='in-tooltip__tag-frame--li'>
                  <Tooltip content={<TagToolTip tag={tag}/>}
                           align={'auto'}>
                    <Tag tag={tag} sceneObject={this.props.sceneObject}/>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  }
});
