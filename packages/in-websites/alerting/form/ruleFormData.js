/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { operators } from 'in-analyze/applicationFilter';

export const ruleJsErrorsOperatorOptions = Object.freeze([
  { value: operators.NOT_EMPTY, label: 'Any' },
  { value: operators.EQUALS, label: 'Equals' },
  { value: operators.CONTAINS, label: 'Contains' },
  { value: operators.STARTS_WITH, label: 'Starts with' },
  { value: operators.ENDS_WITH, label: 'Ends with' }
]);

export const ruleStatusCodeValueOptions = Object.freeze([
  { value: '1', label: '1XX (Informational)' },
  { value: '100', label: '100 (Continue)' },
  { value: '101', label: '101 (Switching Protocols)' },
  { value: '102', label: '102 (Processing)' },
  { value: '103', label: '103 (Early Hints)' },
  { value: '2', label: '2XX (Success)' },
  { value: '200', label: '200 (OK)' },
  { value: '201', label: '201 (Created)' },
  { value: '202', label: '202 (Accepted)' },
  { value: '203', label: '203 (Non-authoritative Information)' },
  { value: '204', label: '204 (No Content)' },
  { value: '205', label: '205 (Reset Content)' },
  { value: '206', label: '206 (Partial Content)' },
  { value: '207', label: '207 (Multi-Status)' },
  { value: '208', label: '208 (Already Reported)' },
  { value: '226', label: '226 (IM Used)' },
  { value: '3', label: '3XX (Redirection)' },
  { value: '300', label: '300 (Multiple Choices)' },
  { value: '301', label: '301 (Moved Permanently)' },
  { value: '302', label: '302 (Found)' },
  { value: '303', label: '303 (See Other)' },
  { value: '304', label: '304 (Not Modified)' },
  { value: '305', label: '305 (Use Proxy)' },
  { value: '306', label: '306 (Switch Proxy)' },
  { value: '307', label: '307 (Temporary Redirect)' },
  { value: '308', label: '308 (Permanent Redirect)' },
  { value: '4', label: '4XX (Client Error)' },
  { value: '400', label: '400 (Bad Request)' },
  { value: '401', label: '401 (Unauthorized)' },
  { value: '402', label: '402 (Payment Required)' },
  { value: '403', label: '403 (Forbidden)' },
  { value: '404', label: '404 (Not Found)' },
  { value: '405', label: '405 (Method Not Allowed)' },
  { value: '406', label: '406 (Not Acceptable)' },
  { value: '407', label: '407 (Proxy Authentication Required)' },
  { value: '408', label: '408 (Request Timeout)' },
  { value: '409', label: '409 (Conflict)' },
  { value: '410', label: '410 (Gone)' },
  { value: '411', label: '411 (Length Required)' },
  { value: '412', label: '412 (Precondition Failed)' },
  { value: '413', label: '413 (Payload Too Large)' },
  { value: '414', label: '414 (Request-URI Too Long)' },
  { value: '415', label: '415 (Unsupported Media Type)' },
  { value: '416', label: '416 (Requested Range Not Satisfiable)' },
  { value: '417', label: '417 (Expectation Failed)' },
  { value: '418', label: "418 (I'm a teapot)" },
  { value: '421', label: '421 (Misdirected Request)' },
  { value: '422', label: '422 (Unprocessable Entity)' },
  { value: '423', label: '423 (Locked)' },
  { value: '424', label: '424 (Failed Dependency)' },
  { value: '426', label: '426 (Upgrade Required)' },
  { value: '428', label: '428 (Precondition Required)' },
  { value: '429', label: '429 (Too Many Requests)' },
  { value: '431', label: '431 (Request Header Fields Too Large)' },
  { value: '444', label: '444 (Connection Closed Without Response)' },
  { value: '451', label: '451 (Unavailable For Legal Reasons)' },
  { value: '499', label: '499 (Client Closed Request)' },
  { value: '5', label: '5XX (Server Error)' },
  { value: '500', label: '500 (Internal Server Error)' },
  { value: '501', label: '501 (Not Implemented)' },
  { value: '502', label: '502 (Bad Gateway)' },
  { value: '503', label: '503 (Service Unavailable)' },
  { value: '504', label: '504 (Gateway Timeout)' },
  { value: '505', label: '505 (HTTP Version Not Supported)' },
  { value: '506', label: '506 (Variant Also Negotiates)' },
  { value: '507', label: '507 (Insufficient Storage)' },
  { value: '508', label: '508 (Loop Detected)' },
  { value: '510', label: '510 (Not Extended)' },
  { value: '511', label: '511 (Network Authentication Required)' },
  { value: '599', label: '599 (Network Connect Timeout Error)' }
]);

export const ruleMetricNameOptions = Object.freeze({
  specificJsError: [
    { value: 'errors', label: 'Error Count' },
    { value: 'specificJsErrorRate', label: 'Error Rate' }
  ],
  statusCode: [
    { value: 'httpxxx', label: 'Status Code Count' },
    { value: 'specificStatusCodeRate', label: 'Status Code Rate' }
  ],
  slowness: [{ value: 'onLoadTime', label: 'onLoad Time' }],
  throughput: [
    { value: 'pageLoads', label: 'Page Loads' },
    { value: 'pageTransitions', label: 'Page Transitions' }
  ]
});

export const ruleAggregationOptions = Object.freeze([
  { value: 'MEAN', label: 'mean' },
  { value: 'MIN', label: 'min' },
  { value: 'P25', label: '25th' },
  { value: 'P50', label: '50th' },
  { value: 'P75', label: '75th' },
  { value: 'P90', label: '90th (recommended)' },
  { value: 'P95', label: '95th' },
  { value: 'P98', label: '98th' },
  { value: 'P99', label: '99th' },
  { value: 'MAX', label: 'max' }
]);

export const ruleAggregationForWeeklySeasonalityOptions = Object.freeze([
  { value: 'MEAN', label: 'mean' },
  { value: 'P50', label: '50th' }
]);

export function getStatusCodeLabel(value) {
  return ruleStatusCodeValueOptions.filter(entry => entry.value === value)[0].label;
}

export function getRuleOperatorLabel(value) {
  return ruleJsErrorsOperatorOptions.filter(entry => entry.value === value)[0].label;
}
