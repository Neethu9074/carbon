/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import InfrastructureEntityLinkPresenter from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/InfrastructureEntityLink/InfrastructureEntityLinkPresenter';
import { getSnapshotOrDefaultOnTimeout } from 'in-stores/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { pendingResult } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

const InfrastructureEntityLink = connectTo(({ entity }) => ({
  // load a snapshot to possibly get a more specific entity (process vs. Spring Boot app)
  snapshot:
    entity &&
    entity.id &&
    entity.time &&
    getSnapshotOrDefaultOnTimeout(entity.id, null, 5000, getTimeConfigAtMoment(entity.time)).startWith(pendingResult)
}))(InfrastructureEntityLinkPresenter);

export default InfrastructureEntityLink;
