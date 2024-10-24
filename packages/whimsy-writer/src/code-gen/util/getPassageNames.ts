import { DuplicateNameError, PassageMap } from '../types';

export function getPassageNames(passageMap: PassageMap) {
  const nameMap: Record<string, string[]> = {};
  passageMap.forEach((fileExports, path) => {
    Object.values(fileExports).forEach((passageName) => {
      if (!(passageName in nameMap)) nameMap[passageName] = [];
      nameMap[passageName].push(path);
    });
  });

  const passageNames: string[] = [];
  const duplicateNameErrors: DuplicateNameError[] = [];
  for (const [passageName, filePaths] of Object.entries(nameMap)) {
    if (filePaths.length > 1) {
      duplicateNameErrors.push({ passageName, filePaths });
    } else {
      passageNames.push(passageName);
    }
  }

  return { passageNames, duplicateNameErrors };
}
