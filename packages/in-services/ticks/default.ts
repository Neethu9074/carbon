/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Tick, TickRequest } from 'in-services/ticks/types';

export default function getTickPositions({ scale }: TickRequest): Tick[] {
  const rangeFrom = scale.getRangeFrom();
  const rangeTo = scale.getRangeTo();
  const domainFrom = scale.getDomainFrom();
  const domainTo = scale.getDomainTo();

  return [
    {
      range: rangeFrom,
      domain: domainFrom
    },
    {
      range: rangeTo,
      domain: domainTo
    }
  ];
}
