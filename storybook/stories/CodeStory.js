import { storiesOf } from '@storybook/react';
import React from 'react';

import Code from 'in-components/Code';

storiesOf('Code', module)
  .add('JSON', () => (
    <Code
      lang="json"
      line={0}
      code={
        '{\n    "glossary": {\n        "title": "example glossary",\n        "GlossDiv": {\n            "title": "S",\n            "GlossList": {\n                "GlossEntry": {\n                    "ID": "SGML",\n                    "SortAs": "SGML",\n                    "GlossTerm": "Standard Generalized Markup Language",\n                    "Acronym": "SGML",\n                    "Abbrev": "ISO 8879:1986",\n                    "GlossDef": {\n                        "para": "A meta-markup language, used to create markup languages such as DocBook.",\n                        "GlossSeeAlso": ["GML", "XML"]\n                    },\n                    "GlossSee": "markup"\n                }\n            }\n        }\n    }\n}\n'
      }
      showLineNumbers
    />
  ))
  .add('Java', () => (
    <Code
      lang="java"
      line={0}
      code={
        '/* HelloWorld.java\n */\n\npublic class HelloWorld\n{\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}'
      }
      showLineNumbers={false}
    />
  ))
  .add('SQL', () => (
    <Code
      lang="sql"
      line={0}
      code={"SELECT FirstName, LastName, City, Country \nFROM Customer\nWHERE City = 'Paris'\nORDER BY LastName"}
      showLineNumbers
    />
  ))
  .add('Ruby', () => (
    <Code
      lang="ruby"
      line={0}
      code={
        '# Operators are really method invocations.\na = 10\nb = 3.*(a).+(2)\nKernel::printf("%d %d\n", a, b);\n\n# Type is still dynamic.\nb = String.new("A string")\nc = \'Another String\'\nKernel.print(b.+(" and ")::+(c).+("\n"))'
      }
      showLineNumbers
    />
  ))
  .add('yaml', () => (
    <Code
      lang="yaml"
      line={0}
      code={
        '--- !clarkevans.com/^invoice\ninvoice: 34843\ndate   : 2001-01-23\nbill-to: &id001\n    given  : Chris\n    family : Dumars\n    address:\n        lines: |\n            458 Walkman Dr.\n            Suite #292\n        city    : Royal Oak\n        state   : MI\n        postal  : 48046\nship-to: *id001\nproduct:\n    - sku         : BL394D\n      quantity    : 4\n      description : Basketball\n      price       : 450.00\n    - sku         : BL4438H\n      quantity    : 1\n      description : Super Hoop\n      price       : 2392.00\ntax  : 251.42\ntotal: 4443.52\ncomments: >\n    Late afternoon is best.\n    Backup contact is Nancy\n    Billsmer @ 338-4338.'
      }
      showLineNumbers
    />
  ))
  .add('php', () => (
    <Code
      lang="php"
      line={0}
      code={
        "// Get the private context \nsession_name('Private'); \nsession_start(); \n$private_id = session_id(); \n$b = $_SESSION['pr_key']; \nsession_write_close(); \n\n// Get the global context \nsession_name('Global'); \nsession_id('TEST'); \nsession_start(); \n\n$a = $_SESSION['key']; \nsession_write_close(); "
      }
      showLineNumbers
    />
  ));
