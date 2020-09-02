# Test Debugging

## VSCode Debugger

It can be useful to set up the debugger in VSCode to help. Getting the deubgger running requires a little bit of setup.

- Open the VSCode `Debug` menu and select `Add Configuration`, then select `Node.js`
- This creates a `launch.json` and where you should paste in the following code.

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Mocha Tests",
            "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
            "args": [
                "--timeout",
                "6000",
                "--require",
                "./packages/in-test/testHarness",
                "${workspaceFolder}/packages/FILE_TO_DEBUG"
            ],
            "internalConsoleOptions": "openOnSessionStart"
        }
    ]
}
```

Update the argument to target whatever files you want to run the debugger on. You can now use breakpoints to help debug your code in the debugging panel.
