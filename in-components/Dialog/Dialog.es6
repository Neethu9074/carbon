'use strict';

import React from 'react/addons';
import * as ro from 'reactive-observables';

import classnames from 'in-services/util/classnames';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import './Dialog.less';

const rpt = React.PropTypes;
const block = 'in-dialog';
const escapeKeycode = 27;

const Dialog = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    onClose: rpt.func,
    children: rpt.any
  },

  componentDidMount() {
    this.addSubscription(
      ro.on(window, 'keyup')
        .subscribe(e => {
          if (e.keyCode === escapeKeycode && this.props.onClose) {
            this.props.onClose();
          }
        })
    );
  },

  render() {
    return (
      <div>
        <div className={classnames({
               [block + '__backdrop']: true,
               [block + '__backdrop--clickable']: !!this.props.onClose
             })}
             onClick={this.props.onClose}/>
        <div className={block + '__content'}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default Dialog;
