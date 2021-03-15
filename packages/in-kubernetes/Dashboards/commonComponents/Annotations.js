/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';
import _ from 'lodash';

import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './Annotations.mless';

export default connectTo(
  ({ snapshotId, annotations }) => {
    if (annotations || !snapshotId) {
      return {};
    }

    return {
      annotations: getAnnotations(snapshotId)
    };
  },
  function AnnotationsList({ annotations, onEmptyText }) {
    const formattedAnnotations =
      annotations &&
      annotations.map(({ key, value }) => ({
        key,
        value: formatAnnotation(value)
      }));

    return (
      <KeyValueList
        title={t('in-kubernetes:dashboards.annotations')}
        items={formattedAnnotations}
        onEmptyText={onEmptyText}
      />
    );
  }
);

function formatAnnotation(value) {
  const code = parseAnnotation(value);
  return (
    <div className={locals.noLeftPadding}>
      <Code showLineNumbers={false} code={code.formatted} lang={code.lang} />
    </div>
  );
}

function parseAnnotation(value) {
  return _(formatters)
    .map(formatter => tryToFormat(formatter, value))
    .find(Boolean);
}

const formatters = [
  {
    lang: 'json',
    format: value => JSON.stringify(JSON.parse(value), null, 2)
  },
  {
    // default formatter
    format: value => value
  }
];

function tryToFormat(formatter, value) {
  try {
    return {
      lang: formatter.lang,
      formatted: formatter.format(value)
    };
  } catch (e) {
    return null;
  }
}
