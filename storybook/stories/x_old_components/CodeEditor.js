import { storiesOf } from '@storybook/react';
import React from 'react';

import EditAsJsonDialog from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/components/EditAsJsonDialog';
import Editor from 'in-components/Editor';
import Root from '../_helpers/Root';

storiesOf('old_components/CodeEditor', module)
  .add('Simple', () => <JSON />)
  .add('Dialog', () => <Dialog />);

const json =
  '{\n    "glossary": {\n        "title": "example glossary",\n        "GlossDiv": {\n            "title": "S",\n            "GlossList": {\n                "GlossEntry": {\n                    "ID": "SGML",\n                    "SortAs": "SGML",\n                    "GlossTerm": "Standard Generalized Markup Language",\n                    "Acronym": "SGML",\n                    "Abbrev": "ISO 8879:1986",\n                    "GlossDef": {\n                        "para": "A meta-markup language, used to create markup languages such as DocBook.",\n                        "GlossSeeAlso": ["GML", "XML"]\n                    },\n                    "GlossSee": "markup"\n                }\n            }\n        }\n    }\n}\n';

function JSON() {
  return (
    <Root>
      <Editor
        value={json}
        options={{
          mode: 'application/json',
          styleActiveLine: true,
          lineNumbers: true,
          lint: true,
          gutters: ['CodeMirror-lint-markers']
        }}
      />
    </Root>
  );
}

function Dialog() {
  return <EditAsJsonDialog initialValue={json} onSaveAndClose={() => {}} onClose={close} />;
}
