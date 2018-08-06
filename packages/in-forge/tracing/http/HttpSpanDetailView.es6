import React from 'react';

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
        <DescriptionItem title="SOAP Action">{span.getIn(['data', 'soap', 'action'])}</DescriptionItem>
        {params != null && (
          <DescriptionItem title="Parameters">{isBlank(params) ? '<no query parameters>' : params}</DescriptionItem>
        )}
        <DescriptionItem title="Method">{span.getIn(['data', 'http', 'method'])}</DescriptionItem>
        <DescriptionItem title="Status Code">{span.getIn(['data', 'http', 'status'])}</DescriptionItem>
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

        {error && (
          <DescriptionItem title="Error">
            <Code code={error} lang="plain" />
          </DescriptionItem>
        )}
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
