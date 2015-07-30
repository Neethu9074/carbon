'use strict';

import React from 'react/addons';

import classnames from 'in-services/util/classnames';
import Icon from 'in-components/Icon';

import './FloatingFrame.less';

const rpt = React.PropTypes;
const block = 'in-floating-frame';

const FloatingFrame = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    title: rpt.string.isRequired,
    icon: rpt.string.isRequired,
    content: rpt.func.isRequired,
    contentProps: rpt.object
  },

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    const Content = this.props.content;

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

          <Icon type={this.state.open ? 'sidebar_close' : this.props.icon}
                className={block + '__icon'}/>
        </h1>

        {this.state.open ?
          <div className={block + '__content'}>
            <Content {...this.props.contentProps} />
          </div>
        : null}
      </div>
    );
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  },

  open() {
    this.setState({
      open: true
    });
  },

  close() {
    this.setState({
      open: false
    });
  }
});

export default FloatingFrame;
