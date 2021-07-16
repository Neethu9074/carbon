/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

declare module 'in-services/util/json/jsurl2' {
  export function parse(s: string): any;
  export function stringify(obj: any): string;
}
