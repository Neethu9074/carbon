

import React from 'react/addons';
import * as ro from 'reactive-observables';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import './Dialog.less';

const rpt = React.PropTypes;
const block = 'in-dialog';
const escapeKeycode = 27;

const Dialog = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    className: rpt.string,
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
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <section className={classes}>
        <div className={block + '__content'}>
          {this.props.children}
        </div>
      </section>
    );
  }
});

export default Dialog;
