/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const days = {
  toMillis: (_days: number) => hours.toMillis(_days * 24),
  toHours: (_days: number) => _days * 24
};

export const hours = {
  toMillis: (_hours: number) => minutes.toMillis(_hours * 60),
  toMinutes: (_hours: number) => _hours * 60
};

export const minutes = {
  toMillis: (_minutes: number) => 1000 * 60 * _minutes
};

export const seconds = {
  toMillis: (_seconds: number) => 1000 * _seconds
};
