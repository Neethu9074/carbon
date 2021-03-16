/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables';
import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import getApplication from 'in-subscription/application/getApplication';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { hasError, isLoading } from 'in-services/util/result';
import getWebsite from 'in-subscription/website/getWebsite';
import KeyValue from 'in-new-components/lists/KeyValue';
import { timeConfig$ } from 'in-stores/time/config';
import SvgIcon from 'in-components/SvgIcon';
import connecTo from 'in-hoc/connectTo';

import locals from './AreaColumnDefinitions.mless';

export const iconColumn = {
  width: '3rem',
  getContent({ item }) {
    return <SvgIcon className={locals.icon} type={item.icon} />;
  }
};

export const labelColumn = {
  getContent({ item }) {
    return <LabelResolver {...item} />;
  }
};

const LabelResolver = connecTo(
  ({ id, label, type }) => {
    let label$;
    if (type === types.APPLICATION) {
      label$ = getApplication({ id }).map(getLabel);
    } else if (type === types.K8S_CLUSTER) {
      label$ = just(id);
    } else if (type === types.K8S_NAMESPACE) {
      label$ = timeConfig$.flatMap(timeConfig => getKubernetesNamespaceLabel(id, timeConfig));
    } else if (type === types.WEBSITE) {
      label$ = getWebsite({ id }).map(getLabel);
    } else if (type === types.MOBILE_APP) {
      label$ = getMobileApp({ id }).map(getLabel);
    } else {
      label$ = just(label);
    }
    return {
      label: label$
    };
  },
  function LabelResolver({ type, label }) {
    return <KeyValue label={type} customValue={label || valueMissingPlaceholder} accentuated />;
  }
);

function getLabel(result) {
  return result?.data?.label || result?.data?.name;
}

function getKubernetesNamespaceLabel(uid, timeConfig) {
  return getKubernetesNamespacesByUid({ uid, page: 1, timeConfig });
}

// this approach is very unfortunate but necessary. We don't store the namespace id, but the snapshots steady id for the area
// therefore, we cannot simply use the "getKubernetesNamespace" subscription to fetch the namespace. We have to
// fetch the list of namespaces and resolve the id. Since the list can become large, we have to fetch buckets as long until we
// reached the matching entry.
function getKubernetesNamespacesByUid({ uid, query = '', page = 1, timeConfig }) {
  return getKubernetesNamespaces({
    pagination: {
      page,
      pageSize: 50
    },
    order: {
      by: 'label',
      direction: 'ASC'
    },
    filter: {
      label: query,
      timeConfig
    }
  }).flatMap(result => {
    if (hasError(result) || isLoading(result) || result.data.items.length === 0) {
      return just(uid);
    }
    const item = result.data.items.filter(item => item.id === uid)[0];
    return item ? just(item.namespace.label) : getKubernetesNamespacesByUid({ uid, page: page + 1, timeConfig });
  });
}
