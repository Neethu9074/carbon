/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Button, ContainedList, ContainedListItem, Stack } from '@instana/carbon';
import { SvgIcon, Typography } from '@instana/components';
import { ChatInstance } from '@instana/ai-chat';
import { timeout } from '@instana/observables';

import {
  ChatButtonOption,
  PromptExample,
  PromptableWidgetType
} from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { ChatButtonGroup } from 'in-custom-dashboards/CustomDashboard/AiChat/components/ChatButtonGroup';
import { t } from 'in-i18n';

const promptableWidgetTypes: ChatButtonOption[] = [
  { key: 'bigNumber', value: t('in-custom-dashboards:widgets.bigNumber.bigNumber') },
  { key: 'TIME_SERIES', value: t('in-custom-dashboards:widgets.index.chartTimeSeries') },
  { key: 'slo2', value: t('in-custom-dashboards:widgets.slo.slo') }
];

interface ExampleMessageProps {
  instance: ChatInstance;
}

export const ExampleMessage = ({ instance }: ExampleMessageProps) => {
  const inputField = instance.elements.getMessageInput();
  const [selectedWidgetType, setSelectedWidgetType] = useState<keyof typeof PromptableWidgetType | undefined>(
    undefined
  );
  return (
    <Stack gap={2}>
      <Typography variant="body-01">{t('in-custom-dashboards:aiChat.tryOutExamplePrompts')}</Typography>
      <ChatButtonGroup
        options={promptableWidgetTypes}
        onClick={({ key }) => {
          setSelectedWidgetType(key);
          timeout(100).once(() => instance.scrollToMessage('examples'));
        }}
      />
      {selectedWidgetType && (
        <ContainedList
          label={
            <Typography variant="body-01">
              {'You can copy these prompts and replace the respective '}
              <Typography variant="body-bold">{'<entities>'}</Typography>
            </Typography>
          }
          kind="on-page"
        >
          {promptExamplesByWidgetType[selectedWidgetType].map(({ id, node, text }) => (
            <ContainedListItem
              key={id}
              action={
                <Button
                  tooltipPosition="left"
                  renderIcon={() => <SvgIcon type="lib_actions_copy" size="xs" />}
                  iconDescription="Copy"
                  kind="ghost"
                  onClick={() => {
                    inputField.setValue(text);
                    inputField.getHTMLElement().focus();
                  }}
                  hasIconOnly
                />
              }
            >
              {node}
            </ContainedListItem>
          ))}
        </ContainedList>
      )}
    </Stack>
  );
};

const promptExamplesByWidgetType: Record<keyof typeof PromptableWidgetType, PromptExample[]> = {
  bigNumber: [
    {
      id: 'bigNumber-1',
      text: 'create a big number widget showing the average latency of <service name>',
      node: (
        <Typography variant="body-01">
          {'create a big number widget showing the average latency of '}
          <Typography variant="body-bold">{'<service name>'}</Typography>
        </Typography>
      )
    },
    {
      id: 'bigNumber-2',
      text: 'show me the number of database calls made to <service name>',
      node: (
        <Typography variant="body-01">
          {'show me the number of database calls made to '}
          <Typography variant="body-bold">{'<service name>'}</Typography>
        </Typography>
      )
    },
    {
      id: 'bigNumber-3',
      text: 'create a big number widget that shows all calls made to <endpoint name> of <service name> service',
      node: (
        <Typography variant="body-01">
          {'create a big number widget that shows all calls made to the endpoint '}
          <Typography variant="body-bold">{'<endpoint name>'}</Typography>
          {' of '}
          <Typography variant="body-bold">{'<service name>'}</Typography>
          {' service'}
        </Typography>
      )
    }
  ],
  TIME_SERIES: [
    {
      id: 'timeSeries-1',
      text: 'show me the amount of erroneous calls of type HTTP in <application name> over time',
      node: (
        <Typography variant="body-01">
          {'show me the amount of erroneous calls of type HTTP in '}
          <Typography variant="body-bold">{'<application name>'}</Typography>
          {' over time'}
        </Typography>
      )
    },
    {
      id: 'timeSeries-2',
      text: 'create a time series chart showing sum of calls of type HTTP in <application name>',
      node: (
        <Typography variant="body-01">
          {'create a time series chart showing sum of calls of type HTTP in '}
          <Typography variant="body-bold">{'<application name>'}</Typography>
        </Typography>
      )
    },
    {
      id: 'timeSeries-3',
      text: 'create a time series chart showing mean latency for <type> calls in <application name>',
      node: (
        <Typography variant="body-01">
          {'create a time series chart showing mean latency for '}
          <Typography variant="body-bold">{'<type>'}</Typography>
          {' calls in '}
          <Typography variant="body-bold">{'<application name>'}</Typography>
        </Typography>
      )
    }
  ],
  slo2: [
    {
      id: 'slo-1',
      text: 'create an SLO widget for <SLO config name>',
      node: (
        <Typography variant="body-01">
          {'create an SLO widget for '}
          <Typography variant="body-bold">{'<SLO config name>'}</Typography>
        </Typography>
      )
    },
    {
      id: 'slo-2',
      text: 'create a widget for SLO configuration <SLO config name>',
      node: (
        <Typography variant="body-01">
          {'create a widget for SLO configuration '}
          <Typography variant="body-bold">{'<SLO config name>'}</Typography>
        </Typography>
      )
    }
  ]
};
