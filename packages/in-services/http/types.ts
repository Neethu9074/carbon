/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface Response<T> {
  status: number,
  statusText?: string,
  body: T,
  getHeader: (name: string) => string | null
}
