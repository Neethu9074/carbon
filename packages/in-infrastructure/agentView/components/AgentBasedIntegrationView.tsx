/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { useState } from 'react';

import { Stack, SvgIcon, Typography, Link, RadioButton } from '@instana/components';
import { themes } from '@instana/design-tokens';

// @ts-expect-error Module needs to be translated to TS
import { Listing } from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
// @ts-expect-error Module needs to be translated to TS
import { Bash } from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import FormFooter, { SaveButton } from 'in-components/form/FormFooter/FormFooter';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { close } from 'in-components/DialogPresenter/store';
import Tooltip from 'in-components/Tooltip';
import { Trans, t } from 'in-i18n';

import locals from './AgentBasedIntegrationView.mless';

function renderValueLines(lines: string[]) {
  return lines.map((line, idx) => (
    <Fragment key={idx}>
      {line}
      {idx !== lines.length - 1 && <br />}
    </Fragment>
  ));
}

function Description({ lines }: { lines: string[] }) {
  return <p>{renderValueLines(lines)}</p>;
}

const AgentBasedIntegrationView = () => {
  const architectureOptions = ['AMD 64', 's390x'];
  const [architecture, setArchitecture] = useState(architectureOptions[0]);
  const supportsUrl = 'https://www.ibm.com/docs/en/instana-observability/current?topic=apis-agent-based-integrations';
  return (
    <DialogWithSlideInView
      title={
        <div className={locals.heading}>
          <Typography variant="heading-400">
            {t('in-infrastructure:agentView.installAgentBasedIntegrations')}
          </Typography>
        </div>
      }
      onClose={close}
      doNotCloseOnOutsideClick
      className={locals.dialog}
    >
      <div className={locals.wrapper}>
        <Typography variant="body-regular">
          <Description lines={[t('in-infrastructure:agentView.installAgentBasedOverlayDescription')]} />
          <Description lines={[t('in-infrastructure:agentView.support')]} />
          <Listing
            items={[
              <div>{t('in-infrastructure:agentView.sap')}</div>,
              t('in-infrastructure:agentView.omegamon'),
              t('in-infrastructure:agentView.itmv6'),
              <Stack direction="horizontal" gap="xsmall" align="center">
                {t('in-infrastructure:agentView.apmv8')}
                <Tooltip
                  content={<div className={locals.tooltip}>{t('in-infrastructure:agentView.apmV8ToolKitInfo')}</div>}
                >
                  <SvgIcon
                    type="lib_help_error_info_outline"
                    size="s"
                    color={themes.default.ids.color.option.neutral['600']}
                  />
                </Tooltip>
              </Stack>
            ]}
          />
          <br />
          <Description lines={[t('in-infrastructure:agentView.description')]} />
        </Typography>
        <div className={locals.archboxview}>
          <Typography variant="body-regular">
            <LightCard
              title={<Typography variant="body-bold"> {t('in-infrastructure:agentView.archType')}</Typography>}
              className={locals.archBox}
            >
              <Stack direction="vertical" gap="xsmall">
                <RadioButton
                  label={t('in-infrastructure:agentView.amd64')}
                  checked={architecture === architectureOptions[0]}
                  onChange={() => setArchitecture(architectureOptions[0])}
                  size="default"
                />
                <RadioButton
                  label={t('in-infrastructure:agentView.s360x')}
                  checked={architecture === architectureOptions[1]}
                  onChange={() => setArchitecture(architectureOptions[1])}
                  size="default"
                />
              </Stack>
            </LightCard>
          </Typography>
        </div>
        <div className={locals.curlCommandBox}>
          <Typography variant="body-bold"> {t('in-infrastructure:agentView.curlCommand')}</Typography>
          <div className={locals.codeBox}>
            <Bash
              lines={[
                architecture === 'AMD 64'
                  ? t('in-infrastructure:agentView.curlCommandForAMD64')
                  : t('in-infrastructure:agentView.curlCommandFors360x')
              ]}
            />
          </div>
          <Typography variant="body-regular">
            <Trans
              i18nKey="in-infrastructure:agentView.additionalHelpAndSupport"
              components={{
                supportLink: (
                  <Link href={supportsUrl} external>
                    {' '}
                  </Link>
                )
              }}
            />
          </Typography>
        </div>
        <FormFooter className={locals.controls}>
          <SaveButton type="submit" kind="primary" onClick={close}>
            {t('in-infrastructure:agentView.footerButtonDone')}
          </SaveButton>
        </FormFooter>
      </div>
    </DialogWithSlideInView>
  );
};
export default AgentBasedIntegrationView;
