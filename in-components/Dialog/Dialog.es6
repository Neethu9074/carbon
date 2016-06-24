import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getClassName} from 'in-services/react';

import './Dialog.less';


const rpt = React.PropTypes;
const block = 'in-dialog';

const Dialog = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    childrenOutsideOfContentFlow: rpt.any,
    className: rpt.string,
    children: rpt.any
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
