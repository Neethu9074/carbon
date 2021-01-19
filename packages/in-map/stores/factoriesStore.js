/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const factories = new Map();

export function addFactory(id, factory) {
  factories.set(id, factory);
  factory.init();
}

export function getFactory(id) {
  return factories.get(id);
}

export function clear() {
  factories.clear();
}
