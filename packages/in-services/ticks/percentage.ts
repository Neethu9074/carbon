/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { roundMaxValueToNextHighestHumanFriendlyValue as roundMaxValueToNextHighestHumanFriendlyValueNumber } from 'in-services/ticks/number';
import { Tick, TickRequest } from 'in-services/ticks/types';

export default function getTickPositions({ scale }: TickRequest): Tick[] {
  const rangeFrom = scale.getRangeFrom();
  const rangeTo = scale.getRangeTo();
  let domainFrom = scale.getDomainFrom();
  let domainTo = scale.getDomainTo();

  domainFrom = Math.max(0, domainFrom);
  domainTo = Math.min(100, domainTo);

  const step = 0.25; // 25% steps

  const ticks = [
    {
      range: rangeFrom,
      domain: domainFrom
    }
  ];

  for (let currentStep = domainFrom; currentStep < domainTo; currentStep += step) {
    ticks.push({
      range: scale.getRange(currentStep),
      domain: currentStep
    });
  }

  ticks.push({
    range: rangeTo,
    domain: domainTo
  });

  return ticks;
}

export function roundMaxValueToNextHighestHumanFriendlyValue(value: number) {
  return roundMaxValueToNextHighestHumanFriendlyValueNumber(value * 10000) / 10000;
}
