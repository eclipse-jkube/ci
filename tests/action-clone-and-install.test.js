const fs = require('fs');
const path = require('path');

describe('action-clone-and-install module test suite', () => {
  let actionCloneAndInstall;
  let execFileSync;
  const metadataPath = path.resolve(__dirname, '..', 'pr-metadata.json');

  beforeEach(() => {
    jest.resetModules();
    execFileSync = jest.fn();
    jest.doMock('child_process', () => ({execFileSync}));
    fs.writeFileSync(
      metadataPath,
      JSON.stringify({cloneUrl: 'https://github.com/contributor/jkube.git', ref: 'my-feature'})
    );
    actionCloneAndInstall = require('../src/action-clone-and-install');
  });

  afterEach(() => {
    try {
      fs.unlinkSync(metadataPath);
    } catch (e) {
      // file may not exist
    }
  });

  test('should clone JKube repo using execFileSync with metadata values', async () => {
    await actionCloneAndInstall();
    expect(execFileSync).toHaveBeenCalledWith(
      'git',
      ['clone', 'https://github.com/contributor/jkube.git', '--branch', 'my-feature', 'jkube'],
      {stdio: 'inherit'}
    );
  });

  test('should run mvn install using execFileSync', async () => {
    await actionCloneAndInstall();
    expect(execFileSync).toHaveBeenCalledWith(
      'mvn',
      ['-B', '-f', 'jkube/pom.xml', '-DskipTests', 'clean', 'install'],
      {stdio: 'inherit'}
    );
  });

  test('should clone IT repo using execFileSync', async () => {
    await actionCloneAndInstall();
    expect(execFileSync).toHaveBeenCalledWith(
      'git',
      ['clone', 'https://github.com/eclipse-jkube/jkube-integration-tests.git', '--branch', 'main', 'jkube-it'],
      {stdio: 'inherit'}
    );
  });

  test('should pass malicious branch name as literal argument', async () => {
    fs.writeFileSync(
      metadataPath,
      JSON.stringify({cloneUrl: 'https://github.com/attacker/jkube.git', ref: 'x$(touch${IFS}/tmp/pwned)'})
    );
    jest.resetModules();
    execFileSync = jest.fn();
    jest.doMock('child_process', () => ({execFileSync}));
    actionCloneAndInstall = require('../src/action-clone-and-install');

    await actionCloneAndInstall();
    expect(execFileSync).toHaveBeenCalledWith(
      'git',
      ['clone', 'https://github.com/attacker/jkube.git', '--branch', 'x$(touch${IFS}/tmp/pwned)', 'jkube'],
      {stdio: 'inherit'}
    );
  });

  test('should call execFileSync exactly 3 times (git clone, mvn, git clone IT)', async () => {
    await actionCloneAndInstall();
    expect(execFileSync).toHaveBeenCalledTimes(3);
  });
});
