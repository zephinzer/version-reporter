const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const versionReporter = {};

versionReporter.getLatestGitCommit = () => {
  return new Promise((resolve, reject) => {
    let errorDetails = '';
    let commitHash = '';
    const gitCommit = exec('git log -n1 --format=%H');
    gitCommit.stdout.on('data', (data) => {
      commitHash += data;
    });
    gitCommit.stderr.on('data', (error) => {
      errorDetails += error;
    });
    gitCommit.on('exit', (code) => {
      if (code == 0) {
        resolve(commitHash);
      } else {
        reject(new Error(errorDetails));
      }
    });
  });
};

versionReporter.getLatestGitTag = () => {
  return new Promise((resolve, reject) => {
    let errorDetails = '';
    let tag = '';
    const gitTag = exec('git describe --abbrev=0 --tags');
    gitTag.stdout.on('data', (data) => {
      tag += data;
    });
    gitTag.stderr.on('data', (error) => {
      errorDetails += error;
    })
    gitTag.on('exit', (code) => {
      if (code == 0) {
        resolve(tag.trim());
      } else {
        reject(new Error(errorDetails));
      }
    });
  });
};

versionReporter.getVersionFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      resolve(data.toString().trim());
    });
  });
};

versionReporter.getVersionFromPackageJson = () => {
  return new Promise((resolve, reject) => {
    const pathToPackageJson = path.join(process.cwd(), '/package.json');
    const {version} = require(pathToPackageJson);
    resolve(version);
  });
};

module.exports = versionReporter;
