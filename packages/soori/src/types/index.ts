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

export type BuildAll = {
  watch?: string[];
  handle: () => BuildOutput | Promise<BuildOutput>;
};

export type BuildPerEachFile = {
  watch: string[];
  handleEach: (params: {
    fullPath: string;
    fileName: string;
    fileNameWithoutExt: string;
  }) => BuildOutput | Promise<BuildOutput>;
};

export type Build = BuildAll | BuildPerEachFile;

export type InternalOutput = {
  dir: string;
  onBuildStart?: (opts: { dir: string }) => Promise<void>;
  onBuildEnd?: (opts: { dir: string }) => Promise<void>;
};

export type Output = Partial<InternalOutput>;

export type Plugin = {
  name: string;
  output?: Output;
  build: Build | Build[];
};

export type InternalPlugin<TBuild = Build> = {
  name: string;
  output: InternalOutput;
  build: TBuild[];
};

export type Config = {
  plugins: Plugin[];
};

export type InternalConfig<TBuild = Build> = {
  plugins: InternalPlugin<TBuild>[];
};
