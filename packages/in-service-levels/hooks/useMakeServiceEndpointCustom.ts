/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';

export default function useMakeServiceEndpointCustom(form: SloForm) {
  const serviceName = form.getIn(['scope', 'serviceId']).value;
  const endpointName = form.getIn(['scope', 'endpointId']).value;
  const tagFilterValue = form.getIn(['scope', 'tagFilterExpression']).value;
  const serviceLabel = useObservable(serviceName ? () => getServiceLabel({ id: serviceName }) : just(null), [
    serviceName
  ]);
  const endpointLabel = useObservable(endpointName ? () => getEndpointInfo({ id: endpointName }) : just(null), [
    endpointName
  ]);

  const tagFilterExpression = [
    ...tagFilterValue,
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    ...(serviceName
      ? [
          {
            type: 'TAG_FILTER',
            name: 'service.name',
            operator: 'EQUALS',
            value: serviceLabel?.data?.label,
            entity: 'DESTINATION'
          }
        ]
      : []),
    ...(endpointName
      ? [
          {
            type: 'TAG_FILTER',
            name: 'endpoint.name',
            operator: 'EQUALS',
            value: endpointLabel?.data?.label,
            entity: 'DESTINATION'
          }
        ]
      : [])
  ];

  return tagFilterExpression;
}
