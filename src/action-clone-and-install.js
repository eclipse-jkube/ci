const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const rmDir = (relativeSrcPath) => {
  const dir = path.resolve(__dirname, '..', relativeSrcPath);
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, {recursive: true});
  }
};

const actionCloneAndInstall = async () => {
  const metadataPath = path.resolve(__dirname, '..', 'pr-metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  console.log(`Cloning JKube from ${metadata.cloneUrl} (branch: ${metadata.ref})...`);
  rmDir(config.jkubeDir);
  child_process.execFileSync('git', [
    'clone', metadata.cloneUrl,
    '--branch', metadata.ref,
    config.jkubeDir
  ], {stdio: 'inherit'});

  console.log(`Installing JKube project from PR...`);
  child_process.execFileSync('mvn', [
    '-B', '-f', `${config.jkubeDir}/pom.xml`,
    '-DskipTests', 'clean', 'install'
  ], {stdio: 'inherit'});

  console.log(`Checking out JKube IT (${config.itRepoGit}) repository (${config.itRevision})...`);
  rmDir(config.jkubeITDir);
  child_process.execFileSync('git', [
    'clone', config.itRepoGit,
    '--branch', config.itRevision,
    config.jkubeITDir
  ], {stdio: 'inherit'});
};

module.exports = actionCloneAndInstall;