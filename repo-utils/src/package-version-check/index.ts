import { fixIssues } from './fix-issues';
import { getIssue } from './get-issues';
import { parseRepoDeps } from './parse-deps';
import { printResults } from './print-results';
import { readRepositoryDependencies } from './read-write-deps';
import { argv, exit } from 'process';

const [, , ...args] = argv;

const repoDependencies = readRepositoryDependencies();
const depsInfo = parseRepoDeps(repoDependencies);
let issues = depsInfo
  .slice()
  .sort((v1, v2) => v1.name.localeCompare(v2.name))
  .map((item) => getIssue(item))
  .filter(Boolean);

if (args.includes('fix')) {
  issues = fixIssues(repoDependencies, issues);
}
printResults(issues);
if (issues.length) exit(1);
