type WorkspaceDeps = {
  [dependency: string]: string;
};
export type RepoDeps = {
  [repository: string]: {
    dependencies: WorkspaceDeps;
    devDependencies: WorkspaceDeps;
  };
};

export interface Usage {
  repo: string;
  version: Version;
  versionIsAllowed: boolean;
  versionIsClean: boolean;
  versionIsNumeric: boolean;
  in: 'dependencies' | 'devDependencies';
  shouldBeIn: 'dependencies' | 'devDependencies' | 'unknown';
}

export interface DependencyInfo {
  name: string;
  usages: Usage[];
  hasVersionMismatch: boolean;
}

export type VersionMap = Record<string, string>;

export interface Issue {
  dependency: string;
  workspaceVersions: {
    [workspace: string]: {
      version: Version;
      targetVersion: Version | null;
      hasVersionMismatch: boolean;
    };
  };
}

export interface NumberedVersion {
  symbol: '^' | '~' | '>' | '<' | '>=' | '<=' | '=';
  major: number;
  minor?: number;
  patch?: number;
  rest?: string;
  raw: string;
}

export type Version =
  | NumberedVersion
  | { symbol: '*'; raw: string }
  | { symbol: 'latest'; raw: string }
  | {
      symbol: '-';
      from: Version;
      to: Version;
      raw: string;
    }
  | {
      symbol: '||';
      options: Version[];
      raw: string;
    }
  | {
      symbol: 'unreadable';
      raw: string;
    };
