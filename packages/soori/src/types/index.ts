import { execaCommand } from 'execa';
type ExecaCommand = typeof execaCommand;

export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | Array<T>;

export type Result<Data = unknown, Err = string> =
  | {
      ok: true;
      data: Data;
    }
  | {
      ok: false;
      error: Err;
    };

export type BuildOutputs = {
  [fileName: string]: string;
};

export type BuildOutput = {
  fileName: string;
  content: string;
};

// export type BuildAll = {
//   watch?: string[];
//   handle: () => BuildOutput | Promise<BuildOutput>;
// };

// export type BuildPerEachFile = {
//   watch: string[];
//   handleEach: (params: {
//     fullPath: string;
//     fileName: string;
//     fileNameWithoutExt: string;
//   }) => BuildOutput | Promise<BuildOutput>;
// };

// export type Build = BuildAll | BuildPerEachFile;

// export type InternalOutput = {
//   dir: string;
//   packageExports?: Partial<{
//     import: string;
//     require: string;
//     types: string;
//   }>;
//   onBuildStart?: (opts: {
//     dir: string;
//     execaCommand: ExecaCommand;
//   }) => Promise<void>;
//   onBuildEnd?: (opts: {
//     dir: string;
//     execaCommand: ExecaCommand;
//   }) => Promise<void>;
// };

// export type Output = Partial<InternalOutput>;

export type Config = {
  plugins: Plugin[];
};

export type InternalConfig = {
  plugins: InternalPlugin[];
};

export type Plugin = {
  name: string;
  watch: string[];
  build: PluginBuild;

  output: string | PluginOutput;
  entry?: PluginEntryBuild | Partial<PluginEntry>;
};

export type InternalPlugin = {
  name: string;
  watch: string[];
  build: PluginBuild;

  output: PluginOutput;
  entry: PluginEntry;
};

export type PluginOutput = {
  name: string;
  dir: string;
  onBuildStart: (params: {
    name: string;
    dir: string;
    dryRun: boolean;
    execaCommand: ExecaCommand;
  }) => MaybePromise<any>;
  onBuildEnd: (params: {
    name: string;
    dir: string;
    dryRun: boolean;
    execaCommand: ExecaCommand;
  }) => MaybePromise<any>;
};

type PluginEntry = {
  build: PluginEntryBuild;
  ext: string;
};

type PluginEntryBuild = (params: {
  filePaths: string[];
  filenames: string[];
  filenamesWithoutExt: string[];
}) => string;

type PluginBuild = (params: {
  filePath: string;
  filename: string;
  filenameWithoutExt: string;
  slug: string;
  ext: string;
}) => MaybePromise<
  | MaybeArray<{
      id: string;
      content: string;
      ext?: string;
    }>
  | undefined
>;
