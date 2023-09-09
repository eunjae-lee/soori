---
title: Why Compile-Time Library?
description: Why do we need it, and how can it help us?
---

## A quick quiz

```
pages/
  ㄴapi/
    ㄴfunction1.js
    ㄴfunction2.js
    ㄴfunction3.js
```

If your repository looks like above, how could you create an array containing
the names of those files?

```js
const functions = ['function1.js', 'function2.js', 'function3.js']; // <- How?
```

Off the top of your head, you might think about using `fs.readdir()` but once
it's bundled and deployed, you won't be able to do that. It's better if you can
handle it during compile-time before bundling and deploying starts.

What if you can write some config and get something like this?

```js
import functions from 'soori/my-functions';

console.log(functions); // ['function1.js', 'function2.js', 'function3.js']
```

Soori enables you to write compile-time library that is exposed as
`soori/<you-name-it>`.

## But, why?

Okay, let's imagine:

- Your website needs to fetch a big chunk of data from an API and renders it.
- But you don't need to do it at runtime.
- It's okay to fetch it only once at compile-time.

How would you implement this? With Soori, you can make a compile-time library
like `soori/something`. It means you get to use it during development, and also,
your CI/CD will use it for deployment.

## Build your own tRPC?

What if you could write something similar to [tRPC](https://trpc.io/) on your
own? (I know, tRPC is much more than this)

```
pages/
  ㄴapi/
    ㄴfunction1.js
    ㄴfunction2.js
    ㄴfunction3.js
```

You may need to repeat this:

```js
function1() {
  try {
    const response = await fetch('/api/function1?hello=world');
    const json = await response.json();
  } catch (e) {
    // deal with it
  }
}
```

Instead of that, what if you could do like this?

```js
import { function1 } from 'soori/my-nextjs-apis';

await function1({ hello: 'world' });
```

> "Wait, what's the difference between writing a helper method that wraps a
> fetch request and handles errors?"

Yes, you're almost there. Bear with me. If you go with a helper method, you
would have to do this:

```js
// src/server/index.js

const requester = (...) => { ... }

export const function1 = requester({ path: '/api/function1', method: 'GET' })
export const function2 = requester({ path: '/api/function2', method: 'GET' })
export const function3 = ...
```

And, each time you add a new API endpoint, you have to add another one manually.
With Soori, you can write a compile-time library that can `fs.readdir()` your
directory and generate whatever you want.

## Is it production-ready?

This is still a proof of concept. Do not use it for production. However, the
beauty of Soori is that it offers submodules during compile-time. If there are
any issues, they will arise during compile-time. You can also view the generated
code under `node_modules/soori/submodules/`.
