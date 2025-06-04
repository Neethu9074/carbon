/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuButton, MenuItem } from '@instana/carbon';
import { SvgIcon } from '@instana/components';

import { clusterListFullyQualified, clusterOtelListFullyQualified } from 'in-kubernetes/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './KubernetesSourceSelector.mless';

type KubernetesDataSource = 'instanaAgent' | 'otelCollector';

export default function DataSourceSelector() {
  const { goToPath, matchLocation } = useNavigation();
  const dataSources = {
    instanaAgent: {
      text: t('in-kubernetes:sourceSelector.instanaAgent.text'),
      icon: 'lib_navigation_stan',
      description: t('in-kubernetes:sourceSelector.instanaAgent.description')
    },
    otelCollector: {
      text: t('in-kubernetes:sourceSelector.otelCollector.text'),
      icon: 'lib_openTelemetry',
      description: t('in-kubernetes:sourceSelector.otelCollector.description')
    }
  };

  return (
    <MenuButton
      id="dataSourceSelector"
      kind="tertiary"
      size="sm"
      label={
        matchLocation(clusterOtelListFullyQualified)
          ? t('in-kubernetes:sourceSelector.otelCollector.text')
          : t('in-kubernetes:sourceSelector.instanaAgent.text')
      }
      menuAlignment="bottom-end"
    >
      <MenuItem
        className={locals.menuitem}
        //@ts-expect-error
        label={renderMenuLabel('instanaAgent')}
        onClick={() => goToPath(clusterListFullyQualified)}
      />
      <MenuItem
        className={locals.menuitem}
        //@ts-expect-error
        label={renderMenuLabel('otelCollector')}
        onClick={() => goToPath(clusterOtelListFullyQualified)}
      />
    </MenuButton>
  );

  function renderMenuLabel(item: KubernetesDataSource) {
    const { icon, text, description } = dataSources[item];
    return (
      <div className={locals.option}>
        <SvgIcon className={locals.optionIcon} type={icon} aria-label={text} />
        <div className={locals.optionText}>
          <div className={locals.label}>{text}</div>
          <div className={locals.description}>{description}</div>
        </div>
      </div>
    );
  }
}
