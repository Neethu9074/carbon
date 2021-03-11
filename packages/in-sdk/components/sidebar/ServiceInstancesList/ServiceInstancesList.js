/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import ServiceListPresenter from 'in-sdk/components/sidebar/ServiceInstancesList/ServiceListPresenter';
import getServicePreviews from 'in-subscription/application/getServicePreviews';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshot }) => ({
    result: timeConfig$.flatMap(timeConfig =>
      getServicePreviews({
        pagination: {
          page: 1,
          pageSize: 100
        },
        order: {
          by: 'serviceLabel',
          direction: 'ASC'
        },
        filter: {
          timeConfig,
          processReference: snapshot.get('entityId')
        }
      })
    )
  }),
  ServiceListPresenter
);
