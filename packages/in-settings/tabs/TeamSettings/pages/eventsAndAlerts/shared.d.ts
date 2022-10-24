/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

export declare const scopeApplication: string;
export declare const scopeEverything: string;
export declare const scopeDfq: string;
export declare const scopeHostsByTag: string;

export interface QueryParsingResult {
  applyOn: string;
  applicationName?: string;
  applicationIds?: Array<string>;
}

export declare function parseQuery(query): QueryParsingResult;
