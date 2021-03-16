/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { List } from 'immutable';

import createSubscription from 'in-subscription/subscription';
import { compareIgnoreCase } from 'in-services/util/string';

export default createSubscription({
  eventId: 'subscribe-filterable-tags',

  getData(subscriptionId, timeConfig) {
    return {
      subscriptionId,
      timeConfig
    };
  },

  transform(observable) {
    return observable.map(filterableTags => {
      filterableTags.sort(compareIgnoreCase);
      return List(filterableTags);
    });
  }
});
