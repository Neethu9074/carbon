import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import { isBlank } from 'in-services/util/string';
import Code from 'in-components/Code';

export default function HttpSpanDetailView({ span }) {
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
    <div>
      <DescriptionList>
        <DescriptionItem title="Host">{span.getIn(['data', 'http', 'host'])}</DescriptionItem>
        <DescriptionItem title="Request Path">{path}</DescriptionItem>
        <DescriptionItem title="Path Template">{span.getIn(['data', 'http', 'path_tpl'])}</DescriptionItem>
        {url && url !== path ? <DescriptionItem title="URL">{url}</DescriptionItem> : null}
        <DescriptionItem title="WSDL Service">{span.getIn(['data', 'http', 'wsdl_srv'])}</DescriptionItem>
        <DescriptionItem title="WSDL Operation">{span.getIn(['data', 'http', 'wsdl_op'])}</DescriptionItem>
        <DescriptionItem title="SOAP Action">{span.getIn(['data', 'soap', 'action'])}</DescriptionItem>
        <DescriptionItem title="Route ID">{span.getIn(['data', 'http', 'route_id'])}</DescriptionItem>
        <DescriptionItem title="Route URI">{span.getIn(['data', 'http', 'route_uri'])}</DescriptionItem>
        <DescriptionItem title="Hystrix Name">{span.getIn(['data', 'http', 'hystrix_name'])}</DescriptionItem>
        <DescriptionItem title="Hystrix Fallback URI">
          {span.getIn(['data', 'http', 'hystrix_fallback_uri'])}
        </DescriptionItem>
        {params != null && (
          <DescriptionItem title="Parameters">{isBlank(params) ? '<no query parameters>' : params}</DescriptionItem>
        )}
        <DescriptionItem title="Method">{span.getIn(['data', 'http', 'method'])}</DescriptionItem>
        {status != null && (
          <DescriptionItem title="Status Code">
            {status}
            {statusCodes[status] != null && ` – ${statusCodes[status]}`}
          </DescriptionItem>
        )}
        <DescriptionItem title="Content Length">
          {span.getIn(['data', 'http', 'size'], span.getIn(['data', 'net', 'in']))}
        </DescriptionItem>
        <DescriptionItem title="Request Header Length">{span.getIn(['data', 'net', 'out'])}</DescriptionItem>
        <DescriptionItem title="Remote Address">{span.getIn(['data', 'peer', 'ip'])}</DescriptionItem>
        <DescriptionItem title="Remote Port">{span.getIn(['data', 'peer', 'port'])}</DescriptionItem>
        {getCustomHeaders(span)}

        {traceContextState &&
          traceContextState.size > 0 && (
            <DescriptionItem title="Trace Context State">
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
            </DescriptionItem>
          )}

        <ErrorDescriptionItem error={error} />
        <CustomDataDescriptionItem span={span} />
      </DescriptionList>
    </div>
  );
}

function getCustomHeaders(span) {
  return span
    .getIn(['data', 'http', 'header'], emptyMap)
    .map((v, k) => {
      return (
        <DescriptionItem title={`Header: ${k}`} key={`header-${k}`}>
          {v}
        </DescriptionItem>
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
