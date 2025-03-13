/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonColumn as Column, CarbonGrid as Grid } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { DNSConfiguration } from '@instana/types';

import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

export const DNSAdditionalProperties = ({ configuration }: { configuration: DNSConfiguration }) => {
  return (
    <>
      <Grid as="div" key={generateUniqueShortId()}>
        <Column md={5} key={'recursiveLookups'}>
          <Grid className={locals.configSubGrid}>
            <Column md={3}>{`${t('in-synthetics:dashboard.configuration.dns.recursiveLookupLabel')} :`}</Column>
            <Column md={2}>
              {configuration.recursiveLookups
                ? t('in-synthetics:dashboard.configuration.dns.dnsRadioButtonOnLabel')
                : t('in-synthetics:dashboard.configuration.dns.dnsRadioButtonOffLabel')}
            </Column>
          </Grid>
        </Column>
        <Column md={5} key={'transportProtocol'}>
          <Grid className={locals.configSubGrid}>
            <Column md={3}>{`${t('in-synthetics:dashboard.configuration.dns.transportProtocolLabel')} :`}</Column>
            <Column md={2}>{configuration.transport}</Column>
          </Grid>
        </Column>
        <Column md={5} key={'acceptCname'}>
          <Grid className={locals.configSubGrid}>
            <Column md={3}>{`${t('in-synthetics:dashboard.configuration.dns.acceptCNAMELabel')} :`}</Column>
            <Column md={2}>
              {configuration.acceptCNAME
                ? t('in-synthetics:dashboard.configuration.dns.dnsRadioButtonOnLabel')
                : t('in-synthetics:dashboard.configuration.dns.dnsRadioButtonOffLabel')}
            </Column>
          </Grid>
        </Column>
      </Grid>
      <Grid as="div" key={generateUniqueShortId()} className={locals.configGrid}>
        <Column md={5} key={'lookupServerName'}>
          <Grid className={locals.configSubGrid}>
            <Column md={3}>{`${t('in-synthetics:dashboard.configuration.dns.lookupServerNamelabel')} :`}</Column>
            <Column md={2}>
              {configuration.lookupServerName
                ? t('in-synthetics:dashboard.configuration.dns.dnsRadioButtonOnLabel')
                : t('in-synthetics:dashboard.configuration.dns.dnsRadioButtonOffLabel')}
            </Column>
          </Grid>
        </Column>
        <Column md={5} key={'serverRetries'}>
          <Grid className={locals.configSubGrid}>
            <Column md={3}>{`${t('in-synthetics:dashboard.configuration.dns.serverRetriesLabel')} :`}</Column>
            <Column md={2}>{configuration.serverRetries}</Column>
          </Grid>
        </Column>
      </Grid>
    </>
  );
};
