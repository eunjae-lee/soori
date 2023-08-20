# 🪄 Soori

Soori allows you to build compile-time libraries.

(copy copied from
[babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros))

## Problem

```
pages/
  ㄴapi/
    ㄴfunction1.js
    ㄴfunction2.js
    ㄴfunction3.js
```

**A quick quiz**: If your repository looks like the example above, how can you
create an array containing the names of those files?

```js
const functions = ['function1.js', 'function2.js', 'function3.js']; // <- How?
```

Off the top of your head, you might think about using `fs.readdir()` but once
it's bundled and deployed, you won't be able to do that. It's better if you can
handle it during compile-time before bundling and deploying starts.

What if Soori gives you something like this?

```js
import functions from 'soori/my-functions';

console.log(functions); // ['function1.js', 'function2.js', 'function3.js']
```

## But, why?

Okay, let's imagine:

- Your website needs to fetch a big chunk of data from an API and renders it.
- But you don't need to do it at runtime.
- It's okay to fetch it once at compile-time.

How would you implement this? You can write a Soori config that provides you
`soori/something` module at compile-time.

Or, what if you could write something similar to [tRPC](https://trpc.io/) on
your own?

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

But import methods like this:

```js
import { function1 } from 'soori/my-nextjs-apis';

await function1({ hello: 'world' });
```

> "Wait, what's the difference between writing a helper method that wraps a
> fetch request and handles errors?"

You're almost there. But you would have to do something like this:

```js
// src/server/index.js

const requester = (...) => { ... }

export const function1 = requester({ path: '/api/function1', method: 'GET' })
export const function2 = requester({ path: '/api/function2', method: 'GET' })
export const function3 = ...
```

And, each time you add an additional API endpoint, you must perform this task
manually.

## Is it production-ready?

This is still a proof of concept. Never use it for production. However, the
beauty of Soori is that it offers submodules during compile-time. If there are
any issues, they will arise during compile-time. You can also view the generated
code under `node_modules/soori/submodules/`.

## Configuration

There is no proper documentation available as things are still unstable.
Instead, please refer to this
[this demo configuration](https://github.com/eunjae-lee/soori/blob/main/apps/demo/soori.config.js)
and
[its usage](https://github.com/eunjae-lee/soori/blob/main/apps/demo/src/main.tsx).

## How to generate submodules based on the config?

You can run `soori build`.

If you're using Vite, you can utilize Soori's Vite plugin for live watching and
on-the-fly building for dev mode.

```js
import { vite } from 'soori';

export default defineConfig({
  plugins: [vite()],
});
```

## TODOs

- [ ] write plugin template with unit tests
- [ ] write cool plugins
