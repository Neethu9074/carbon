'use strict';

import React from 'react/addons';

import classnames from 'instana-ui-services/util/classnames';
import Icon from 'instana-ui-components/Icon';

import './FloatingFrame.less';

const block = 'in-floating-frame';

const FloatingFrame = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    return (
      <div className={classnames({
        [block]: true,
        [block + '--closed']: !this.state.open
      })}>
        <h1 className={classnames({
          [block + '__header']: true,
          [block + '__header--closed']: !this.state.open
        })}
            onClick={this.toggle}>
          {this.props.title}

          <Icon type={this.state.open ? 'menue_close' : this.props.icon}
                className={block + '__icon'}/>
        </h1>

        {this.state.open ?
          <div className={block + '__content'}>
            {this.props.children}
          </div>
        : null}
      </div>
    );
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }
});

export default FloatingFrame;
