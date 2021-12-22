/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Error } from 'in-types';

type PendingFetchedState = [undefined, 'pending', Error[]];
type RejectedFetchedState = [undefined, 'rejected', Error[]];
type ResolvedFetchedState<T> = [T, 'resolved', Error[]];

export type FetchStatus = 'pending' | 'resolved' | 'rejected';
export type FetchedState<T> = Readonly<PendingFetchedState | RejectedFetchedState | ResolvedFetchedState<T>>;
