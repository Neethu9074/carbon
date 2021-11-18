/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

export function toPromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => observable.once(resolve, reject));
}
