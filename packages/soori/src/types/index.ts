export type Output = {
  type: "eject";
  path: string;
} | { type: "submodule"; name: string };

export type Plugin = {
  output: Output;
  build: () => Promise<string>;
};

export type Config = {
  plugins: Plugin[];
};
