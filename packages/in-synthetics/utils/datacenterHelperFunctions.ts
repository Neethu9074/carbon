/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SyntheticDatacenter } from '@instana/types';

export const formatRejectedDatacenters = (rejectedDatacenters: SyntheticDatacenter[]) => {
  let datacenterLocationLabels: string[] = [];
  rejectedDatacenters.forEach( (datacenter) => {
    datacenterLocationLabels.push(datacenter.locationLabel??'');
  });
  let lastTwoDatacenterLocationLabels, remainingDatacenterLocationLabels;
  switch (datacenterLocationLabels.length) {
    case 1:
      return datacenterLocationLabels[0];
    case 2:
      return datacenterLocationLabels.join(' and ');
    default:
      lastTwoDatacenterLocationLabels = datacenterLocationLabels.slice(-2).join(' and ');
      remainingDatacenterLocationLabels = datacenterLocationLabels.slice(0, -2).join(', ');
      return remainingDatacenterLocationLabels.length > 0
        ? `${remainingDatacenterLocationLabels}, ${lastTwoDatacenterLocationLabels}`
        : lastTwoDatacenterLocationLabels;
  }
};

export const categorizeActivationRequestedDatacenters = (response: SyntheticDatacenter[]) => {
  let rejectedArray: SyntheticDatacenter[] = [];
  let acceptedArray: SyntheticDatacenter[] = [];
  response.forEach( (syntheticDatacenter) => {
    if (syntheticDatacenter.status === '409') {
      rejectedArray.push(syntheticDatacenter);
    }
  });
  acceptedArray = response.filter((datacenter: SyntheticDatacenter) => !rejectedArray.includes(datacenter));
  return {
    rejectedArray,
    acceptedArray
  };
};
