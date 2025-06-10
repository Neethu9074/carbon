/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, waitFor } from '@testing-library/react';
import React from 'react';

// @ts-expect-error not ts file
import EditableOptions from 'in-events/components/AIChat/CustomResponse/EditableOptions';

describe('EditableOptions', () => {
  it('should render option from prop', async () => {
    const shouldFind = 'Should find';
    const shouldFindMoreOption = 'A sub option';
    const messageItem = {
      user_defined: {
        options: [
          { key: 'abc', value: shouldFind },
          { key: 'abc2', value: 'Second option' }
        ],
        abc: [{ key: shouldFindMoreOption, value: '' }]
      }
    };
    let handlerFn: () => void;
    const instance = {
      elements: {},
      off: jest.fn(),
      on: ({ type, handler }: { type: string; handler: () => void }) => {
        if (type === 'send') {
          handlerFn = handler;
        }
      }
    };
    const { getByText } = render(<EditableOptions {...{ messageItem, instance }} />);
    // shouldFind is rendered as an option
    expect(getByText(shouldFind)).toBeInTheDocument();
    // Not rendered yet, until click
    expect(() => getByText(shouldFindMoreOption)).toThrow();
    const button = getByText(shouldFind);
    button.click();
    // Now shouldFindMoreOption is rendered
    expect(getByText(shouldFindMoreOption)).toBeInTheDocument();
    getByText(shouldFindMoreOption).click();
    // Only defined after intance.on is called
    await waitFor(() => {
      expect(handlerFn).toBeDefined();
    });
    // Assert exists because value is defined in above waitFor
    handlerFn!();
    // instance.on calls instance.off
    expect(instance.off).toHaveBeenCalled();
  });
  it('should fill text field with suggestion', async () => {
    const shouldFind = 'Should find';
    const shouldFindMoreOption = 'A sub option';
    const shouldFindMoreOptionText = 'Text for above option';
    const messageItem = {
      user_defined: {
        options: [{ key: 'abc', value: shouldFind }],
        abc: [{ key: shouldFindMoreOption, value: shouldFindMoreOptionText }]
      }
    };
    let textValue;
    const focusField = jest.fn();
    const instance = {
      elements: {
        getMessageInput: () => {
          return {
            setValue: (x: string) => {
              textValue = x;
            },
            getHTMLElement: () => {
              return {
                focus: focusField
              };
            }
          };
        }
      },
      off: jest.fn(),
      on: () => {}
    };
    const { getByText } = render(<EditableOptions {...{ messageItem, instance }} />);
    // Click top level option
    const topLevelButton = getByText(shouldFind);
    topLevelButton.click();
    // Click next level option
    const subOptionButton = getByText(shouldFindMoreOption);
    subOptionButton.click();
    // The text value should now be filled with the corresponding text
    expect(textValue).toBe(shouldFindMoreOptionText);
    // The text field should be focused
    expect(focusField).toHaveBeenCalled();
  });
});
