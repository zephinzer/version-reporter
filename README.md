# Version Reporter
A Node component for retrieving version of the current application.

## Usage

```javascript
const versionReporter = require('version-reporter');

// get the latest git tag associated with current commit
versionReporter.getLatestGitTag().then((gitTag) => console.info(gitTag));

// get the latest
versionReporter.getLatestGitCommit().then((gitCommitHash) => console.info(gitCommitHash));

// get the version from a file relative to the process.cwd()
versionReporter.getVersionFromFile('./path/to/.versionfile').then((version) => console.info(version));

// get the version from the package.json file relative to the process.cwd()
versionReporter.getVersionFromPackageJson().then((packageJsonVersion) => console.info(packageJsonVersion));
```

## Installation

```bash
npm install version-reporter;
```

Link to NPM package: https://www.npmjs.com/package/version-reporter

## Development

Fork this, make your changes and submit a pull request.

Run tests with `npm test` and `npm run lint`.

## License

Copyright 2018 [@zephinzer](https://github.com/zephinzer)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.