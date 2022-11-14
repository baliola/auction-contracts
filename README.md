### TESTING AND DOCS IS STILL IN WIP

for testing guide visit truffle docs [here](https://trufflesuite.com/docs/truffle/)

## testing steps

1. install all dependencies using `npm i`
2. run `npm run develop` and then open another terminal
3. run `npm run test-full` to run the tests

# notes

if you want to run the tests without recompiling run `npm run test-fast` in the terminal.

test modifier first, then `require` statements, and then conditional such as `if` and `else`, and then assert the events.

when comparing require error statements, make sure to call `.trim()` method on error strings to avoid whitespace issues.

when asserting `require` errors, use the error definitions on the utils directory

also, it is recommended to tests and asserts return statements.
