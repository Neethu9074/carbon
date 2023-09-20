/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Subject } from '@instana/observables';

import { Node } from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/types';

export type CollectionStream<T> = {
  add: (id: string, object: T) => void;
  has: (id: string) => boolean;
  get: (id: string) => T | undefined;
  remove: (id: string) => void;
  clear: () => void;
  stream: Subject<Map<string, T>>;
  objects: Map<string, T>;
};

export default function createCollection<T>(): CollectionStream<T> {
  const collection: Map<string, T> = new Map();

  const objects$: Subject<Map<string, T>> = create();
  objects$.emit(collection);

  function add(id: string, object: T) {
    collection.set(id, object);
    objects$.emit(collection);
  }

  function has(id: string): boolean {
    return collection.has(id);
  }

  function remove(id: string) {
    collection.delete(id);
    objects$.emit(collection);
  }

  function clear() {
    const items = collection.values() as IterableIterator<Node>;
    for (const item of items) {
      item.dispose();
    }

    collection.clear();
  }

  function get(id: string): any {
    return collection.get(id);
  }

  return {
    add,
    has,
    get,
    remove,
    clear,
    stream: objects$,
    objects: collection
  };
}
