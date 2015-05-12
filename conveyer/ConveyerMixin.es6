/*eslint-disable no-console*/

'use strict';

import SubscriptionMixin from '../util/SubscriptionMixin';

const ConveyerMixin = {
  componentWillMount() {
    SubscriptionMixin.componentWillMount.call(this);
    console.warn(
      '[DEPRECATED]: Please use SubscriptionMixin instead of the ConveyerMixin'
    );
  },

  addSubscription: SubscriptionMixin.addSubscription,

  disposeSubscription: SubscriptionMixin.disposeSubscription,

  disposeSubscriptions: SubscriptionMixin.disposeSubscriptions,

  componentWillUnmount: SubscriptionMixin.componentWillUnmount
};

export default ConveyerMixin;
