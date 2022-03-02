/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/**
 * This type represents what the backend returns in case of technical errors, i.e., through
 * usage of the RestUtil.error(...) calls.
 */
export interface TechnicalHttpApiError {
  errors: string[];
}

// TagType from in-types.d.ts is incomplete. We therefore have to redefine it here.
export type TagType = 'BOOLEAN' | 'STRING' | 'NUMBER' | 'STRING_SET' | 'STRING_LIST' | 'KEY_VALUE_PAIR';

// The UI needs to explicitly differentiate between undefined and null for to and focusedMoment
export interface TimeConfig {
  readonly windowSize: number;
  readonly to?: number | null;
  readonly focusedMoment?: number | null;
  readonly autoRefresh: boolean;
}

// Beacon types are serialized via their internal type field, and not by the enum value name.
// Therefor we redefine the possible values to use the actual casing used in the api.
// See: https://github.ibm.com/instana/backend/blob/251e4b43db264e43a72f53db8bcebb9172e12008/service-level-objectives/slo-shared/src/main/java/com/instana/slo/model/sli/WebsiteSliEntity.java#L78
export type BeaconType = 'pageLoad' | 'resourceLoad' | 'httpRequest' | 'error' | 'custom' | 'pageChange';

// The query context is used in the backend to distinguish a request from the UI using websocket or from the API.
// However we don't need this in the ui-client and we shouldn't have to worry.
export interface HasQueryContext {}
