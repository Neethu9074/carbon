/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { get } from 'lodash';
import React from 'react';

import EndpointExtractionRuleDialog from 'in-applications/Forms/CustomEndpointMapping/EndpointExtractionRuleDialog/EndpointExtractionRuleDialog';
import ExtractionRule from 'in-applications/Forms/CustomEndpointMapping/ExtractionRule';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { testRules } from 'in-api/endpointConfiguration';

import locals from './DragAndDropRuleList.mless';

export default class DragAndDropRuleList extends React.Component {
  displayName = 'DragAndDropRuleList';

  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onSuccess$ = null;
    this.onError$ = null;

    this.state = {
      testResult: null
    };
  }

  componentDidMount() {
    this.testRules();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.testRules();
    }
  }

  componentWillUnmount() {
    if (this.onSuccess$) {
      this.onSuccess$.dispose();
      this.onSuccess$ = null;
    }
    if (this.onError$) {
      this.onError$.dispose();
      this.onError$ = null;
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    this.props.switchIndices(result.source.index, result.destination.index);
  }

  render() {
    const testResult = this.state.testResult;
    const { rules, form, setValue } = this.props;
    if (rules.size === 0) {
      return null;
    }

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef}>
              {rules.map((rule, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {provided => (
                    <div
                      className={locals.item}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ExtractionRule
                        reorderable
                        rule={rule.toJS()}
                        onToggleEnable={enabled => setValue(['rules', index, 'enabled'], enabled, form)}
                        onClick={e => this.onRuleClicked(rules, e, index)}
                        testResult={testResult ? get(testResult, [index], []) : undefined}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  testRules = () => {
    const form = this.props.form;
    const rulesToCheck = form.get('rules').toJS();
    if (rulesToCheck.length === 0) {
      this.setState({
        testResult: null,
        loading: false,
        error: false
      });
      return;
    }

    const result$ = testRules(rulesToCheck);
    this.setState({
      testResult: null,
      loading: true,
      error: false
    });

    this.onSuccess$ = result$.once(testResult => {
      this.setState({
        testResult,
        loading: false,
        error: false
      });
      this.onSuccess$ = null;
    });

    this.onError$ = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true
      });
      this.onError$ = null;
    });
  };

  onRuleClicked = (rules, rule, index) => {
    addActiveDialog(
      <EndpointExtractionRuleDialog
        rules={rules}
        ruleIndex={index}
        rule={rule}
        onSave={_rule => this.props.onSave(_rule, index)}
        onRemove={() => this.props.onRemove(index)}
      />
    );
  };
}
