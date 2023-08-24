export type Result<Data = unknown, Err = string> =
  | {
    ok: true;
    data: Data;
  }
  | {
    ok: false;
    error: Err;
  };

export type BuildOutput = {
  fileName: string;
  content: string;
};

export type Build =
  | {
    handler: () => BuildOutput | Promise<BuildOutput>;
  }
  | {
    watch: string[];
    handler: (params: {
      fullPath: string;
      fileName: string;
      fileNameWithoutExt: string;
    }) => BuildOutput | Promise<BuildOutput>;
  };

export type OutputMode = 'save-and-return' | 'return-only';

export type Plugin = {
  name: string;
  build: Build | Build[];
};

export type InternalPlugin = {
  name: string;
  build: Build[];
};

export type Config = {
  plugins: Plugin[];
};

export type InternalConfig = {
  plugins: InternalPlugin[];
};
