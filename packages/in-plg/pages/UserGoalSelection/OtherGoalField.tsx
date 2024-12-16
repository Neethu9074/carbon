/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Stack, StackItem, TextArea, Typography } from '@instana/components';

import { OTHER_GOAL_MAX_LENGTH } from 'in-plg/pages/UserGoalSelection/utils/consts';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

import locals from 'in-plg/pages/UserGoalSelection/UserGoalSelection.mless';

interface OtherGoal {
  setOtherGoal: Function;
}

const OtherGoalField = (props: OtherGoal) => {
  const { setOtherGoal } = props;
  const [charCount, setCharCount] = useState(0);
  const [text, setText] = useState('');

  const textChangehandler = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const {
      target: { value }
    } = e;
    if (value.length <= OTHER_GOAL_MAX_LENGTH) {
      setCharCount(value.length);
      setText(value);
      setOtherGoal(value);
    }
  };

  return (
    <Row>
      <Col lg={8} xs={12}>
        <Stack gap="xsmall">
          <StackItem>
            <Stack direction="horizontal" distribution="spaceBetween">
              <StackItem>
                <Typography variant="body-small">
                  {t('in-plg:userGoalSelectionDialog.otherGoalToAccomplish')}
                </Typography>
              </StackItem>
              <StackItem>
                <Typography variant="body-small">
                  {charCount} / {OTHER_GOAL_MAX_LENGTH}
                </Typography>
              </StackItem>
            </Stack>
          </StackItem>
          <StackItem>
            <TextArea
              className={locals.textArea}
              id="event-description"
              rows={6}
              placeholder={t('in-plg:userGoalSelectionDialog.otherGoalPlaceholder')}
              value={text}
              onChange={textChangehandler}
            />
          </StackItem>
        </Stack>
      </Col>
    </Row>
  );
};

export default OtherGoalField;
