/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import { operators, entityTypes } from 'in-analyze/applicationFilter';

export default function useMergedServiceEndpointCustomFilters(form: SloForm): FormModelElement[] {
  const serviceName = form.getIn(['scope', 'serviceId']).value;
  const endpointName = form.getIn(['scope', 'endpointId']).value;
  const tagFilterValue = form.getIn(['scope', 'tagFilterExpression']).value ?? [];
  const serviceLabel = useObservable(serviceName ? () => getServiceLabel({ id: serviceName }) : just(null), [
    serviceName
  ]);
  const endpointLabel = useObservable(endpointName ? () => getEndpointInfo({ id: endpointName }) : just(null), [
    endpointName
  ]);

  const tagFilterExpression: FormModelElement[] = [...tagFilterValue];
  if (serviceName)
    tagFilterExpression.push(
      tagFilter('service.name', operators.EQUALS, serviceLabel?.data?.label, entityTypes.DESTINATION)
    );
  if (endpointName)
    tagFilterExpression.push(
      tagFilter('endpoint.name', operators.EQUALS, endpointLabel?.data?.label, entityTypes.DESTINATION)
    );
  return joinExpressions({ expressions: tagFilterExpression, logicalOperator: 'AND' });
}
