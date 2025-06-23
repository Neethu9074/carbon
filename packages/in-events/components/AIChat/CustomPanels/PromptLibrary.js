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

import locals from './PromptLibrary.mless';

const PromptLibrary = ({ instance, chatInstance }) => {
  const [search, setSearch] = useState('');

  return (
    <div id="promptLibrary">
      <CarbonTabs>
        <CarbonTabList className={locals.tabsWidth}>
          {promptLibrary.map(subject => {
            return <CarbonTab className={locals.tabHeader}>{subject.kind}</CarbonTab>;
          })}
        </CarbonTabList>
        <CarbonSearch
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
        <CarbonTabPanels>
          {promptLibrary.map(subject => {
            return (
              <CarbonTabPanel className={locals.panel}>
                <CarbonContainedList label={subject.kind} size="lg" className={locals.listHeader}>
                  {subject.questions
                    .filter(question => question.includes(search))
                    .map(question => {
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
