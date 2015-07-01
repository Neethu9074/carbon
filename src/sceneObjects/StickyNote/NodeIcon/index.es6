'use strict';

import React from 'react/addons';
import eventBus from 'instana-ui-services/eventbus';
import {getIcon} from 'instana-ui-sdk/snapshot';

import './index.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  getInitialState() {
    return {size: 50};
  },

  componentDidMount() {
    this.subscription = eventBus.on('nodeSizeChanged').subscribe((size) => {
      this.setState({size});
    });
  },

  componentWillUnmount() {
    if(this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  },

  render() {
    const icon = getIcon(this.props.snapshot);
    const size = this.state.size * 0.6 + 'px';
    const style = {width: size, height: size};

    return (
      <div style={style} className='in-sticky-note__icon-background'>
        {icon ?
          <img src={icon} className='in-sticky-note__icon-svg'/> : null}
      </div>
    );
  }
});
