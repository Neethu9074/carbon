/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

export declare const teamSettingsActionCatalog: string;
export declare const teamSettingsActionDetailsNew: string;
export declare const teamSettingsAlertingEventBuiltIn: string;
export declare const teamSettingsAlertingEventCustom: string;
export declare function getEntityIdView(path: string, id: string): Observable<string>;
