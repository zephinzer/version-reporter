const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const {expect} = require('chai');

const versionReporter = require('./');

describe('version-reporter', () => {
  let gitExists;
  before((done) => {
    const checkIfGitLogExists = exec('git version');
    checkIfGitLogExists.on('exit', (code) => {
      gitExists = (code === 0);
      done();
    });
  });

  it('has the correct keys', () => {
    expect(versionReporter).to.have.keys([
      'getLatestGitCommit',
      'getLatestGitTag',
      'getVersionFromFile',
      'getVersionFromPackageJson',
    ]);
  });

  describe('.getLatestGitCommit()', () => {
    const fn = versionReporter.getLatestGitCommit;

    it('works as expected', function(done) {
      if (!gitExists) {
        this.skip(); // eslint-disable-line no-invalid-this
        done();
      } else {
        let gitHash = '';
        const gitLogLastCommit = exec('git log -n1 --format=%H');
        gitLogLastCommit.stdout.on('data', (data) => (gitHash += data));
        gitLogLastCommit.on('exit', () => {
          fn().then((result) => {
            expect(result).to.eql(gitHash);
            done();
          });
        });
      }
    });
  });

  describe('.getLatestGitTag()', () => {
    const fn = versionReporter.getLatestGitTag;

    it('works as expected', function(done) {
      if (!gitExists) {
        this.skip(); // eslint-disable-line no-invalid-this
        done();
      } else {
        let actualGitTags = ['', ''];
        let observedGitTags = ['', ''];
        let gitHash = '';
        const cleanup = () => {
          exec(`set -e; git tag -d 123456789; git tag -d 123456790; git reset --hard ${gitHash}; git stash pop;`); // eslint-disable-line max-len
        };
        const stashCurrentChanges = exec('git stash');
        stashCurrentChanges.on('exit', () => {
          const getCommitHash = exec('git log -n1 --format=%H');
          getCommitHash.stdout.on('data', (data) => {
            gitHash += data;
          });
          getCommitHash.on('exit', () => {
            const createGitTag = exec('git tag 123456789');
            createGitTag.on('exit', () => {
              const checkTag = exec('git describe --abbrev=0 --tags');
              checkTag.stdout.on('data', (data) => {
                actualGitTags[0] += data.toString().trim();
              });
              checkTag.on('exit', () => {
                expect(actualGitTags[0]).to.eql('123456789');
                fn().then((result) => {
                  try {
                    observedGitTags[0] = result;
                    expect(actualGitTags[0]).to.eql(observedGitTags[0]);
                  } catch (ex) {
                    cleanup();
                    done(ex);
                  }
                  const createNewCommit = exec('git commit -m "_ testing commit" --allow-empty'); // eslint-disable-line max-len
                  createNewCommit.on('exit', (code) => {
                    const createNextGitTag = exec('git tag 123456790');
                    createNextGitTag.on('exit', () => {
                      const checkTagAgain = exec('git describe --abbrev=0 --tags'); // eslint-disable-line max-len
                      checkTagAgain.stdout.on('data', (data) => {
                        actualGitTags[1] += data.toString().trim();
                      });
                      checkTagAgain.on('exit', () => {
                        expect(actualGitTags[1]).to.eql('123456790');
                        fn().then((result) => {
                          try {
                            observedGitTags[1] = result;
                            expect(actualGitTags[1]).to.eql(observedGitTags[1]);
                          } catch (ex) {
                            cleanup();
                            done(ex);
                          }
                          const resetTags = exec('git tag -d 123456789 && git tag -d 123456790'); // eslint-disable-line max-len
                          resetTags.on('exit', () => {
                            const resetCommit = exec(`git reset --hard ${gitHash}`); // eslint-disable-line max-len
                            resetCommit.on('exit', () => {
                              const popStashChanges = exec('git stash pop');
                              popStashChanges.on('exit', done);
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  });

  describe('.getVersionFromFile()', () => {
    const fn = versionReporter.getVersionFromFile;

    it('works as expected', (done) => {
      const pathToVersionFile = path.join(
        process.cwd(), '/.test_version_file_version_repoter'
      );
      fs.writeFileSync(pathToVersionFile, '1.2.3');
      try {
        fn(pathToVersionFile).then((result) => {
          expect(result).to.eql('1.2.3');
          fs.unlink(pathToVersionFile, done);
        }).catch((err) => {
          fs.unlinkSync(pathToVersionFile);
          done(err);
        });
      } catch (ex) {
        fs.unlinkSync(pathToVersionFile);
        done(ex);
      }
    });
  });

  describe('.getVersionFromPackageJson()', () => {
    const fn = versionReporter.getVersionFromPackageJson;

    it('works as expected', () => {
      const version = require(
        path.join(process.cwd(), '/package.json')
      ).version;
      return fn().then((result) => {
        expect(result).to.eql(version);
      });
    });
  });
});
