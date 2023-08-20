export type BuildOutput =
  | string
  | {
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
