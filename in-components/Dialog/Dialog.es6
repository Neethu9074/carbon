import React from 'react';
import * as ro from 'reactive-observables';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getClassName} from 'in-services/react';

import './Dialog.less';

const rpt = React.PropTypes;
const block = 'in-dialog';
const escapeKeycode = 27;

const Dialog = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    className: rpt.string,
    onClose: rpt.func,
    children: rpt.any,

    childrenOutsideOfContentFlow: rpt.any
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
      <section className={getClassName(this, block)}>
        <div className={getClassName(this, block, '__child-wrapper')}>
          {this.props.childrenOutsideOfContentFlow}
          <div className={getClassName(this, block, '__content')}>
            {this.props.children}
          </div>
        </div>
      </section>
    );
  }
});

export default Dialog;
