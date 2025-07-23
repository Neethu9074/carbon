/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Error, Progress } from '@instana/types';
type PendingFetchedState = [undefined, 'pending', Error[], Progress];
type RejectedFetchedState = [undefined, 'rejected', Error[], Progress];
type ResolvedFetchedState<T> = [T, 'resolved', Error[], Progress];

export type FetchStatus = 'pending' | 'resolved' | 'rejected';
export type FetchedState<T> = Readonly<PendingFetchedState | RejectedFetchedState | ResolvedFetchedState<T>>;
