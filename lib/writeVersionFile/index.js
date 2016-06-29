const jsonfile = require('jsonfile');
jsonfile.spaces = 2;
const git = require('git-rev-sync');

const tag = git.tag();
const short = git.short();
const branch = git.branch();
const message = git.message();

const versionObject = {
  tag,
  short,
  branch,
  message,
};

jsonfile.writeFileSync('./server/version.json', versionObject);
