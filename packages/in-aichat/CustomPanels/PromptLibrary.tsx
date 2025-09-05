/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ChatInstance } from '@carbon/ai-chat';
import React, { useState } from 'react';

import {
  CarbonTabs,
  CarbonTabList,
  CarbonTab,
  CarbonTabPanel,
  CarbonTabPanels,
  CarbonContainedList,
  CarbonContainedListItem,
  CarbonSearch
} from '@instana/components';

import { handleTracking } from 'in-aichat/utils/utils';
import { t } from 'in-i18n';

import locals from './PromptLibrary.mless';

type QuestionGroup = {
  kind: string;
  questions: string[];
};

type QuestionGroupList = QuestionGroup[];
interface PromptLibraryProps {
  setInstructionPopOpen: Function;
  instance: ChatInstance;
  library: QuestionGroupList;
  trackingIdentifier?: string;
}

const PromptLibrary = ({ instance, setInstructionPopOpen, library, trackingIdentifier }: PromptLibraryProps) => {
  const [search, setSearch] = useState('');

  return (
    <div id="promptLibrary">
      <CarbonTabs>
        <CarbonTabList className={locals.tabsWidth} aria-label={t('in-aichat:aichat.tabSelection')}>
          {library.map((subject: { kind: string }, index: number) => {
            return (
              <CarbonTab className={locals.tabHeader} key={`tab-${subject.kind}-${index}`}>
                {subject.kind}
              </CarbonTab>
            );
          })}
        </CarbonTabList>
        <CarbonSearch
          labelText={t('in-aichat:aichat.search')}
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
        <CarbonTabPanels>
          {library.map((subject: { kind: string; questions: Array<string> }, index: number) => {
            return (
              <CarbonTabPanel className={locals.panel} key={`panel-${index}`}>
                <CarbonContainedList label={subject.kind} size="lg" className={locals.listHeader}>
                  {subject.questions
                    .filter((question: string) => question.includes(search))
                    .map((question: string, index: number) => {
                      return (
                        <CarbonContainedListItem
                          key={`question-${index}`}
                          onClick={() => {
                            const customPanel = instance?.customPanels?.getPanel();
                            const textField = instance?.elements?.getMessageInput?.();
                            trackingIdentifier && handleTracking(trackingIdentifier, { promptSelection: question });
                            // On Click we want to take the value of the prompt
                            // and then enter it into the textField
                            if (textField) {
                              textField.setValue(question);
                              customPanel.close();
                              textField.getHTMLElement?.()?.focus();
                              setTimeout(() => {
                                setInstructionPopOpen(true);
                              }, 500);
                            }
                          }}
                        >
                          {question}
                        </CarbonContainedListItem>
                      );
                    })}
                </CarbonContainedList>
              </CarbonTabPanel>
            );
          })}
        </CarbonTabPanels>
      </CarbonTabs>
    </div>
  );
};

export default PromptLibrary;
