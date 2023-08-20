# Soori

Soori allows you to build compile-time libraries.

(copy copied from
[babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros))

## Problem

A quick quiz:

```
pages/
  ㄴapi/
    ㄴfunction1.js
    ㄴfunction2.js
    ㄴfunction3.js
```

If your repository is like above, how can you have an array of those file names?

```js
const functions = ['function1.js', 'function2.js', 'function3.js']; // <- How?
```

Off the top of your head, you may think about using `fs.readdir()` but once it's
bundled and deployed, you cannot do that. It's the best if you can deal with it
on compile-time before bundling and deploying begins.

What if Soori provides something like this?

```js
import functions from 'soori/my-functions';

console.log(functions); // ['function1.js', 'function2.js', 'function3.js']
```

## But, why?

Okay, let's imagine:

- Your website needs to fetch a big chunk of data from an API.
- You render a part of the response.
- But you don't need to do it on runtime.
- It's okay to fetch one at compile-time.

How would you implement this? You can write a Soori config that provides you
`soori/something` module in compile-time.

Or, what if you can write something like tRPC by yourself?

```
pages/
  ㄴapi/
    ㄴfunction1.js
    ㄴfunction2.js
    ㄴfunction3.js
```

No need to repeat this:

```js
try {
  const response = await fetch('/api/function1?hello=world');
  const json = await response.json();
} catch (e) {
  // deal with it
}
```

but import methods like this:

```js
import { function1 } from 'soori/my-nextjs-apis';

await function1({ hello: 'world' });
```

Wait, what's different from writing a helper method that wraps fetch request and
error handling? You're very close. But you would have to do something like this:

```js
// src/server/index.js

const requester = (...) => { ... }

export const function1 = requester({ path: '/api/function1', method: 'GET' })
export const function2 = requester({ path: '/api/function2', method: 'GET' })
export const function3 = ...
```

Every time you add one more API endpoint, you have to manually do this.

## Can I use it for production?

This is a proof of concept yet. Don't ever use it for your production. But, the
beauty of Soori is that it provides submodules in compile-time. If it breaks, it
will break in compile-time. And you get to see the code generation under
`node_modules/soori/submodules/`.

## Configuration

No proper documentation, because nothing is stable yet. Instead, read
[this demo config](https://github.com/eunjae-lee/soori/blob/main/apps/demo/soori.config.js),
and
[its usage](https://github.com/eunjae-lee/soori/blob/main/apps/demo/src/main.tsx).

## How to generate this submodules based on the config?

You can run `soori build`.

If you're using `vite`, then you can also use Soori's vite plugin to watch and
build on the fly.

```js
import { vite } from 'soori';

export default defineConfig({
  plugins: [vite()],
});
```
