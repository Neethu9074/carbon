/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const days = {
  toMillis: _days => hours.toMillis(_days * 24),
  toHours: _days => _days * 24
};

export const hours = {
  toMillis: _hours => minutes.toMillis(_hours * 60),
  toMinutes: _hours => _hours * 60
};

export const minutes = {
  toMillis: _minutes => 1000 * 60 * _minutes
};

export const seconds = {
  toMillis: _seconds => 1000 * _seconds
};
