/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
      <Di title={t('in-forge:tracing.http.titleHost')}>{span.getIn(['data', 'http', 'host'])}</Di>
      <Di title={t('in-forge:tracing.http.titleRequestPath')}>{path}</Di>
      <Di title={t('in-forge:tracing.http.titleContextRoot')}>{span.getIn(['data', 'http', 'context_root'])}</Di>
      <Di title={t('in-forge:tracing.http.titlePathTemplate')}>{span.getIn(['data', 'http', 'path_tpl'])}</Di>
      {url && url !== path ? <Di title={t('in-forge:tracing.http.titleURL')}>{url}</Di> : null}
      <Di title={t('in-forge:tracing.http.titleWSDLService')}>{span.getIn(['data', 'http', 'wsdl_srv'])}</Di>
      <Di title={t('in-forge:tracing.http.titleWSDLOperation')}>{span.getIn(['data', 'http', 'wsdl_op'])}</Di>
      <Di title={t('in-forge:tracing.http.titleSOAPAction')}>{span.getIn(['data', 'soap', 'action'])}</Di>
      <Di title={t('in-forge:tracing.http.titleRouteID')}>{span.getIn(['data', 'http', 'route_id'])}</Di>
      <Di title={t('in-forge:tracing.http.titleRouteURI')}>{span.getIn(['data', 'http', 'route_uri'])}</Di>
      <Di title={t('in-forge:tracing.http.titleHystrixName')}>{span.getIn(['data', 'http', 'hystrix_name'])}</Di>
      <Di title={t('in-forge:tracing.http.titleHystrixFallbackURI')}>
        {span.getIn(['data', 'http', 'hystrix_fallback_uri'])}
      </Di>
      {params != null && (
        <Di title={t('in-forge:tracing.http.titleParameters')}>{isBlank(params) ? '<no query parameters>' : params}</Di>
      )}
      <Di title={t('in-forge:tracing.http.titleMethod')}>{span.getIn(['data', 'http', 'method'])}</Di>
      {status != null && (
        <Di title={t('in-forge:tracing.http.titleStatusCode')} rowClassName={status >= 500 ? locals.error : ''}>
          {status}
          {statusCodes[status] != null && ` – ${statusCodes[status]}`}
        </Di>
      )}
      <Di title={t('in-forge:tracing.http.titleContentLength')}>
        {span.getIn(['data', 'http', 'size'], span.getIn(['data', 'net', 'in']))}
      </Di>
      <Di title={t('in-forge:tracing.http.titleRequestHeaderLength')}>{span.getIn(['data', 'net', 'out'])}</Di>
      <Di title={t('in-forge:tracing.http.titleRemoteAddress')}>{span.getIn(['data', 'peer', 'ip'])}</Di>
      <Di title={t('in-forge:tracing.http.titleRemotePort')}>{span.getIn(['data', 'peer', 'port'])}</Di>
      {getCustomHeaders(span)}

      {traceContextState && traceContextState.size > 0 && (
        <Di title={t('in-forge:tracing.http.titleTraceContextState')} verticalDisplay>
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
        <Di title={t('in-forge:tracing.http.titleHeader', { headerLabel: k })} key={`header-${k}`}>
          {v}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}

const statusCodes = {
  100: t('in-forge:tracing.http.statusCode100'),
  101: t('in-forge:tracing.http.statusCode101'),
  102: t('in-forge:tracing.http.statusCode102'),
  103: t('in-forge:tracing.http.statusCode103'),
  200: t('in-forge:tracing.http.statusCode200'),
  201: t('in-forge:tracing.http.statusCode201'),
  202: t('in-forge:tracing.http.statusCode202'),
  203: t('in-forge:tracing.http.statusCode203'),
  204: t('in-forge:tracing.http.statusCode204'),
  205: t('in-forge:tracing.http.statusCode205'),
  206: t('in-forge:tracing.http.statusCode206'),
  207: t('in-forge:tracing.http.statusCode207'),
  208: t('in-forge:tracing.http.statusCode208'),
  226: t('in-forge:tracing.http.statusCode226'),
  300: t('in-forge:tracing.http.statusCode300'),
  301: t('in-forge:tracing.http.statusCode301'),
  302: t('in-forge:tracing.http.statusCode302'),
  303: t('in-forge:tracing.http.statusCode303'),
  304: t('in-forge:tracing.http.statusCode304'),
  305: t('in-forge:tracing.http.statusCode305'),
  306: t('in-forge:tracing.http.statusCode306'),
  307: t('in-forge:tracing.http.statusCode307'),
  308: t('in-forge:tracing.http.statusCode308'),
  400: t('in-forge:tracing.http.statusCode400'),
  401: t('in-forge:tracing.http.statusCode401'),
  402: t('in-forge:tracing.http.statusCode402'),
  403: t('in-forge:tracing.http.statusCode403'),
  404: t('in-forge:tracing.http.statusCode404'),
  405: t('in-forge:tracing.http.statusCode405'),
  406: t('in-forge:tracing.http.statusCode406'),
  407: t('in-forge:tracing.http.statusCode407'),
  408: t('in-forge:tracing.http.statusCode408'),
  409: t('in-forge:tracing.http.statusCode409'),
  410: t('in-forge:tracing.http.statusCode410'),
  411: t('in-forge:tracing.http.statusCode411'),
  412: t('in-forge:tracing.http.statusCode412'),
  413: t('in-forge:tracing.http.statusCode413'),
  414: t('in-forge:tracing.http.statusCode414'),
  415: t('in-forge:tracing.http.statusCode415'),
  416: t('in-forge:tracing.http.statusCode416'),
  417: t('in-forge:tracing.http.statusCode417'),
  418: t('in-forge:tracing.http.statusCode418'),
  421: t('in-forge:tracing.http.statusCode421'),
  422: t('in-forge:tracing.http.statusCode422'),
  423: t('in-forge:tracing.http.statusCode423'),
  424: t('in-forge:tracing.http.statusCode424'),
  426: t('in-forge:tracing.http.statusCode426'),
  428: t('in-forge:tracing.http.statusCode428'),
  429: t('in-forge:tracing.http.statusCode429'),
  431: t('in-forge:tracing.http.statusCode431'),
  451: t('in-forge:tracing.http.statusCode451'),
  500: t('in-forge:tracing.http.statusCode500'),
  501: t('in-forge:tracing.http.statusCode501'),
  502: t('in-forge:tracing.http.statusCode502'),
  503: t('in-forge:tracing.http.statusCode503'),
  504: t('in-forge:tracing.http.statusCode504'),
  505: t('in-forge:tracing.http.statusCode505'),
  506: t('in-forge:tracing.http.statusCode506'),
  507: t('in-forge:tracing.http.statusCode507'),
  508: t('in-forge:tracing.http.statusCode508'),
  510: t('in-forge:tracing.http.statusCode510'),
  511: t('in-forge:tracing.http.statusCode511')
};
