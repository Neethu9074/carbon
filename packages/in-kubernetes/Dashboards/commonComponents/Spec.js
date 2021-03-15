/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import yaml from 'js-yaml';
import React from 'react';

import { getRawPayload } from 'in-stores/snapshot';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshotId }) => {
    return {
      spec: getRawPayload(snapshotId, 'spec')
    };
  },
  function SpecList({ spec }) {
    if (!spec || spec.length === 0) {
      return null;
    }

    return (
      <Card title={t('in-kubernetes:dashboards.spec')}>
        <Code showLineNumbers={false} code={yaml.safeDump(spec.toJS())} lang="yaml" />
      </Card>
    );
  }
);
