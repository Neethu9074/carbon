/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

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

import { promptLibrary } from 'in-events/components/AIChat/DefinedQuestions';
import { t } from 'in-i18n';

import locals from './PromptLibrary.mless';

interface PromptLibraryProps {
  instance: {
    customPanels: {
      getPanel: Function;
    };
    elements: {
      getMessageInput: Function;
    };
  };
}

const PromptLibrary = ({ instance }: PromptLibraryProps) => {
  const [search, setSearch] = useState('');

  return (
    <div id="promptLibrary">
      <CarbonTabs>
        <CarbonTabList className={locals.tabsWidth} aria-label={t('in-events:aichat.tabSelection')}>
          {promptLibrary.map((subject: { kind: string }) => {
            return <CarbonTab className={locals.tabHeader}>{subject.kind}</CarbonTab>;
          })}
        </CarbonTabList>
        <CarbonSearch
          labelText={t('in-events:aichat.search')}
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
        <CarbonTabPanels>
          {promptLibrary.map((subject: { kind: string; questions: Array<string> }) => {
            return (
              <CarbonTabPanel className={locals.panel}>
                <CarbonContainedList label={subject.kind} size="lg" className={locals.listHeader}>
                  {subject.questions
                    .filter((question: string) => question.includes(search))
                    .map((question: string) => {
                      return (
                        <CarbonContainedListItem
                          onClick={() => {
                            const customPanel = instance?.customPanels?.getPanel();
                            const textField = instance?.elements?.getMessageInput?.();
                            // On Click we want to take the value of the prompt
                            // and then enter it into the textField
                            if (textField) {
                              textField.setValue(question);
                              customPanel.close();
                              textField.getHTMLElement?.()?.focus();
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
