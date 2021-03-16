/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { positiveNumber } from 'in-services/formatters/number';
import { minutes } from 'in-services/formatters/number';
import { t } from 'in-i18n';
import Info from '../Info';

export default function TomcatSidebar({ snapshot }) {
  const connectors = snapshot.getIn(['data', 'connector-config']);
  const executors = snapshot.getIn(['data', 'executor-config']);
  const webapps = snapshot.getIn(['data', 'webapps']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.tomcatAppContainer.headerTomcat')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      {webapps && webapps.size > 0 && (
        <Collapsible initiallyOpen>
          <Collapsible.Header>{t('in-forge:plugins.tomcatAppContainer.headerWebapps')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {webapps.keySeq().map(name => (
                <Fragment key={name}>
                  <DescriptionItem
                    key={name}
                    title={t('in-forge:plugins.tomcatAppContainer.titleContext')}
                    addSeparator
                  >
                    {name}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleSessionTimeout')}>
                    {minutes.compact(webapps.getIn([name, 'session-timeout']))}
                  </DescriptionItem>
                </Fragment>
              ))}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}

      {connectors && connectors.size > 0 && (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{t('in-forge:plugins.tomcatAppContainer.titleConnectors')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {connectors.toArray().map((data, i) => (
                <Fragment key={i}>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titlePort')} addSeparator>
                    {data.get('port')}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleExecutor')}>
                    {data.get('executor')}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleMaxThreads')}>
                    {data.getIn(['threads', 'max'])}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleMaxConnections')}>
                    {data.getIn(['connections', 'max'])}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleConnectTimeout')}>
                    {positiveNumber(data.get('connect-timeout'))}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleKeepaliveTimeout')}>
                    {positiveNumber(data.get('keepalive-timeout'))}
                  </DescriptionItem>
                </Fragment>
              ))}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}

      {executors && executors.size > 0 && (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{t('in-forge:plugins.tomcatAppContainer.titleExecutors')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {executors.toArray().map((data, i) => (
                <Fragment key={i}>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleMaxThreads')} addSeparator>
                    {data.get('maxThreads')}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleMaxIdle')}>
                    {data.get('maxIdleTime')}
                  </DescriptionItem>
                  <DescriptionItem title={t('in-forge:plugins.tomcatAppContainer.titleCorePool')}>
                    {data.get('corePoolSize')}
                  </DescriptionItem>
                </Fragment>
              ))}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}

      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
