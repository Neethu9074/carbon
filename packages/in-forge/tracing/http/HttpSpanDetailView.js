/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyList, emptyMap } from 'in-services/fixedImmutables';
import { isBlank } from 'in-services/util/string';
import Code from 'in-components/Code';

import locals from './HttpSpanDetailView.mless';

export default function HttpSpanDetailView({ span }) {
  return (
    <Dl>
      <HttpSpanDetailViewDescriptionList span={span} />
    </Dl>
  );
}

export function HttpSpanDetailViewDescriptionList({ span }) {
  const url = span.getIn(['data', 'http', 'url']);
  let path = span.getIn(['data', 'http', 'path']);
  if (url) {
    try {
      const a = document.createElement('a');
      a.href = url;
      path = a.pathname;
    } catch (e) {
      // ignore
    }
  }

  const status = span.getIn(['data', 'http', 'status']);
  const error = span.getIn(['data', 'http', 'error']);
  const params = span.getIn(['data', 'http', 'params']);
  const traceContextState = span.getIn(['data', 'tc', 's'], emptyList);

  return (
    <Fragment>
      <Di title="Host">{span.getIn(['data', 'http', 'host'])}</Di>
      <Di title="Request Path">{path}</Di>
      <Di title="Context Root">{span.getIn(['data', 'http', 'context_root'])}</Di>
      <Di title="Path Template">{span.getIn(['data', 'http', 'path_tpl'])}</Di>
      {url && url !== path ? <Di title="URL">{url}</Di> : null}
      <Di title="WSDL Service">{span.getIn(['data', 'http', 'wsdl_srv'])}</Di>
      <Di title="WSDL Operation">{span.getIn(['data', 'http', 'wsdl_op'])}</Di>
      <Di title="SOAP Action">{span.getIn(['data', 'soap', 'action'])}</Di>
      <Di title="Route ID">{span.getIn(['data', 'http', 'route_id'])}</Di>
      <Di title="Route URI">{span.getIn(['data', 'http', 'route_uri'])}</Di>
      <Di title="Hystrix Name">{span.getIn(['data', 'http', 'hystrix_name'])}</Di>
      <Di title="Hystrix Fallback URI">{span.getIn(['data', 'http', 'hystrix_fallback_uri'])}</Di>
      {params != null && <Di title="Parameters">{isBlank(params) ? '<no query parameters>' : params}</Di>}
      <Di title="Method">{span.getIn(['data', 'http', 'method'])}</Di>
      {status != null && (
        <Di title="Status Code" rowClassName={status >= 500 ? locals.error : ''}>
          {status}
          {statusCodes[status] != null && ` – ${statusCodes[status]}`}
        </Di>
      )}
      <Di title="Content Length">{span.getIn(['data', 'http', 'size'], span.getIn(['data', 'net', 'in']))}</Di>
      <Di title="Request Header Length">{span.getIn(['data', 'net', 'out'])}</Di>
      <Di title="Remote Address">{span.getIn(['data', 'peer', 'ip'])}</Di>
      <Di title="Remote Port">{span.getIn(['data', 'peer', 'port'])}</Di>
      {getCustomHeaders(span)}

      {traceContextState && traceContextState.size > 0 && (
        <Di title="Trace Context State" verticalDisplay>
          <Code
            code={JSON.stringify(
              traceContextState.toJS().reduce((agg, { k, v }) => {
                agg[k] = v;
                return agg;
              }, {}),
              0,
              2
            )}
            lang="json"
          />
        </Di>
      )}

      <ErrorDescriptionItem error={error} />
    </Fragment>
  );
}

function getCustomHeaders(span) {
  return span
    .getIn(['data', 'http', 'header'], emptyMap)
    .map((v, k) => {
      return (
        <Di title={`Header: ${k}`} key={`header-${k}`}>
          {v}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}

const statusCodes = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'Switch Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  426: 'Upgrade Required',
  428: 'Precondition Required', // RFC 6585
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large', // RFC 6585
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required'
};
