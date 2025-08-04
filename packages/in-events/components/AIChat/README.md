# AIChat Component

A flexible and customizable AI chat interface for Instana applications.

## Overview

The AIChat component provides a draggable chat interface that integrates with Instana's AI capabilities. It's built on top of the [IBM Carbon AI Chat](https://web-chat.global.assistant.watson.cloud.ibm.com/carbon-chat.html) package, providing additional customization and integration with Instana's ecosystem.

## Features

- **Draggable Chat Interface**: Users can move the chat window around the screen
- **Custom Response Types**: Support for various response formats (tables, charts, prompt libraries)
- **Custom Menu Options**: Add your own menu items to the chat interface
- **Custom Panels**: Add custom panels for additional functionality
- **Preview Pill**: Optional preview indicator for beta features
- **Tracking Integration**: Built-in tracking for user interactions
- **Customizable Language Pack**: Modify text labels in the chat interface

## Installation

The AIChat component is part of the `in-events` package and can be imported directly:

```jsx
import { AIChat } from 'in-events/components/AIChat/AIChat';
```

## Basic Usage

```jsx
import React from 'react';
import { AIChat } from 'in-events/components/AIChat/AIChat';
import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';

export default function MyAIChat() {
  return (
    <AIChat
      config={{
        messaging: {
          customSendMessage: CustomSendMessages,
          disablePDFViewer: true
        }
      }}
    />
  );
}
```

## Required Configuration

The AIChat component requires a custom message handler to be included in the config prop. While you can use the provided `CustomSendMessages` as a reference, you will most likely need to create your own implementation to support your specific API endpoints and backend responses:

```jsx
import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';
// Or import your own custom implementation
// import { MyCustomSendMessages } from './MyCustomSendMessages';

const config = {
  messaging: {
    customSendMessage: CustomSendMessages // Or MyCustomSendMessages
    // Other messaging options...
  }
  // Other config options...
};
```

### Creating Your Own Message Handler

The message handler is responsible for:
- Processing user queries and sending them to your API endpoints
- Formatting API responses for display in the chat interface
- Handling error cases and providing appropriate feedback
- Supporting different response types (tables, events, etc.)

You can use the existing `CustomSendMessages` implementation in `packages/in-events/components/AIChat/CustomSendMessages.js` as a template for your own implementation. Your custom handler should follow this signature:

```typescript
async function MyCustomSendMessages(
  request: MessageRequest,
  requestOptions: CustomSendMessageOptions,
  instance: ChatInstance
) {
  // Your implementation here
  // Process the user's query
  // Make API calls to your backend
  // Format and display responses
}
```

When creating your own implementation, you can leverage the existing response types and utilities to maintain consistency with the rest of the application.

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `config` | [`PublicConfig`](https://web-chat.global.assistant.watson.cloud.ibm.com/carbon-tsdocs/interfaces/PublicConfig.html) | Configuration for the chat container | `{}` |
| `customResponseDefinitions` | `CustomResponseDefinition[]` | Custom response types | `undefined` |
| `customMenuOptions` | `Function` | Function that returns custom menu options | `undefined` |
| `customPanelConfig` | `CustomPanelConfig` | Configuration for custom panels | `undefined` |
| `onAfterRender` | `Function` | Callback after chat is rendered | `undefined` |
| `onBeforeRender` | `Function` | Callback before chat is rendered | `undefined` |
| `aiToolTipContent` | `ReactNode` | Custom tooltip content | `undefined` |
| `previewPill` | `boolean` | Whether to show preview pill | `false` |

## Advanced Usage

### Custom Menu Options

You can add custom menu options to the chat interface:

```jsx
<AIChat
  config={config}
  customMenuOptions={(customPanel) => {
    return [
      {
        text: 'Prompt Library',
        handler: () => {
          customPanel.open({ title: 'Prompt Library' });
          // Additional actions
        }
      },
      {
        text: 'Feedback',
        handler: () => {
          window.open('https://your.feedback.url', '_blank');
        }
      }
    ];
  }}
/>
```

### Custom Panels

You can add custom panels to the chat interface:

```jsx
<AIChat
  config={config}
  customPanelConfig={{
    customPanelElement: (instance) => {
      return (
        <PromptLibrary
          library={promptLibrary}
          instance={instance}
          // Additional props
        />
      );
    }
  }}
/>
```

## Response Types

### Built-in Response Types

The AIChat component comes with several pre-built response types that you can leverage in your implementation:

- `prompt_library`: Displays a prompt library with suggested queries
- `table_chart`: Displays data in a table or chart format with toggle options
- `nlg_response`: Displays a natural language generation response
- `events_table`: Displays an events table with specialized formatting
- `thumbs_feedback`: Displays a thumbs up/down feedback component
- `option_buttons`: Displays customizable option buttons for user interaction

These built-in response types are already implemented and can be used directly. You can examine their implementations in the following files:

- `PromptLibraryResponse.tsx`: For prompt library responses
- `TableChartSwitcher.tsx`: For table/chart toggle views
- `NLGResponse.tsx`: For natural language generation responses
- `EventsTable.tsx`: For events table responses
- `ThumbsFeedback.tsx`: For feedback collection
- `OptionsResponse.tsx`: For option buttons responses

### Leveraging and Contributing to Response Types

When implementing your own AI Chat instance, you have three options for handling response types:

1. **Use existing response types**: Leverage the pre-built response types that are already available in the shared codebase. This promotes consistency across different implementations and reduces duplication of effort.

2. **Create custom response definitions as props**: Create your own response types and pass them as props to the AIChat component without modifying the shared codebase. This is useful for team-specific or experimental response types.

3. **Contribute new response types to the shared codebase**: Add your custom response types directly to the shared codebase so other teams can benefit from your work. This is recommended for generally useful response types.

#### Option 1: Using Existing Response Types

To use an existing response type in your custom message handler:

```jsx
// Import the response object creator
import { TableChartObject } from 'in-events/components/AIChat/ResponseObjects';

// In your custom message handler
const response = {
  output: {
    generic: [
      TableChartObject(headers, rows)
    ]
  }
};
```

#### Option 2: Creating Custom Response Definitions as Props

To create custom response types without modifying the shared codebase:

```jsx
// Define your custom response component
const MyCustomResponse = ({ messageItem }) => {
  // Your custom rendering logic
  return <div>...</div>;
};

// Pass it as a prop to the AIChat component
<AIChat
  config={config}
  customResponseDefinitions={[
    {
      key: 'my_custom_type',
      handler: () => <MyCustomResponse />
    }
  ]}
/>

// Use it in your custom message handler
const response = {
  output: {
    generic: [
      {
        response_type: 'user_defined',
        user_defined: {
          user_defined_type: 'my_custom_type',
          // Your data here
        }
      }
    ]
  }
};
```

#### Option 3: Contributing to the Shared Codebase

To contribute a new response type that can be shared across teams:

1. **Add a new constant in `ResponseObjects.ts`**:
   ```typescript
   export const USER_DEFINED_MY_CUSTOM_TYPE = 'my_custom_type';
   ```

2. **Create a new object creator function in `ResponseObjects.ts`**:
   ```typescript
   export function MyCustomObject(data): UserDefinedItem {
     return {
       response_type: MessageResponseTypes.USER_DEFINED,
       user_defined: {
         user_defined_type: USER_DEFINED_MY_CUSTOM_TYPE,
         // Your custom data here
         data
       }
     };
   }
   ```

3. **Add a new case in `UserDefinedResponse.tsx`**:
   ```typescript
   const cases: Cases = {
     // Existing cases...
     my_custom_type: () => <MyCustomResponse messageItem={messageItem} />
   };
   ```

4. **Create your custom response component**:
   ```typescript
   // MyCustomResponse.tsx
   const MyCustomResponse = ({ messageItem }) => {
     // Your custom rendering logic
     return <div>...</div>;
   };
   ```

By following this pattern, your custom response type becomes available to all teams using the AIChat component, promoting code reuse and consistency across the application.

This collaborative approach allows teams to build upon each other's work, creating a richer set of response types over time without duplicating effort.

## Lifecycle Hooks

You can hook into the chat lifecycle:

```jsx
<AIChat
  config={config}
  onBeforeRender={(chatInstance) => {
    // Do something before the chat is rendered
  }}
  onAfterRender={(chatInstance) => {
    // Do something after the chat is rendered
  }}
/>
```

## Complete Example

Here's a complete example of how to use the AIChat component:

```jsx
import React, { useState } from 'react';
import { AIChat } from 'in-events/components/AIChat/AIChat';
import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';
import { handleTracking } from 'in-events/components/AIChat/utils/utils';
import AITooltipContent from 'in-events/components/AIChat/components/AITooltipContent';
import PromptLibrary from 'in-events/components/AIChat/CustomPanels/PromptLibrary';

export default function AIChatExample() {
  const [instructionPopOpen, setInstructionPopOpen] = useState(false);

  const config = {
    messaging: {
      customSendMessage: CustomSendMessages
    }
  };

  const promptLibrary = [
    {
      kind: 'Application',
      questions: [
        'Show me calls with high latency for service <service-name>.',
        'Show me erroneous calls for service <service-name>.'
      ]
    },
    {
      kind: 'Infrastructure',
      questions: [
        'Show me the total number of failed queries to DB2 database.',
        'Show me the total number of runnable threads.'
      ]
    }
  ];

  return (
    <AIChat
      config={config}
      customMenuOptions={(customPanel) => {
        return [
          {
            text: 'Prompt Library',
            handler: () => {
              customPanel.open({ title: 'Prompt Library' });
              setInstructionPopOpen(false);
            }
          },
          {
            text: 'Feedback',
            handler: () => {
              window.open('https://your.feedback.url', '_blank');
            }
          }
        ];
      }}
      customPanelConfig={{
        customPanelElement: (instance) => {
          return (
            <PromptLibrary
              library={promptLibrary}
              instance={instance}
              setInstructionPopOpen={setInstructionPopOpen}
            />
          );
        }
      }}
      aiToolTipContent={<AITooltipContent />}
      previewPill={true}
    />
  );
}
```

## Utility Functions

The AIChat component provides several utility functions:

- `handleTracking`: Track user interactions
- `moveAIChatLauncher`: Reposition the launcher button
- `setupDragListeners`: Set up drag listeners for the chat window
- `setupCustomLanguagePack`: Customize the language pack

## Carbon AI Chat Integration

This component is built on top of the [IBM Carbon AI Chat](https://web-chat.global.assistant.watson.cloud.ibm.com/carbon-chat.html) package. The Carbon AI Chat provides the core functionality, while our AIChat component adds Instana-specific customizations and integrations.

### Carbon AI Chat Documentation

For detailed information about the underlying Carbon AI Chat package and its capabilities, refer to the [Carbon AI Chat TypeScript Documentation](https://web-chat.global.assistant.watson.cloud.ibm.com/carbon-tsdocs/index.html).

### Extending Functionality

The AIChat component is designed to be extensible. If you need functionality that's available in the Carbon AI Chat but not exposed in our wrapper, you can:

1. Access the chat instance directly through the `onBeforeRender` or `onAfterRender` props
2. Propose changes to the AIChat component to expose additional Carbon AI Chat features
3. Use the Carbon AI Chat's configuration options through the `config` prop
