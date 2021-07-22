/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// TagType from in-types.d.ts is incomplete. We therefore have to redefine it here.
export type TagType = 'BOOLEAN' | 'STRING' | 'NUMBER' | 'STRING_SET' | 'STRING_LIST' | 'KEY_VALUE_PAIR';

// The UI needs to explicitly differentiate between undefined and null for to and focusedMoment
export interface TimeConfig {
  readonly windowSize: number;
  readonly to?: number | null;
  readonly focusedMoment?: number | null;
  readonly autoRefresh: boolean;
}
