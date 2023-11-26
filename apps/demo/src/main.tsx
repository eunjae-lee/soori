import React from 'react';
import ReactDOM from 'react-dom/client';
import { cat1, cat2 } from 'soori/json-gen';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>
      <p>Try editing `apps/demo/src/jsons/cat1.json` or `cat2.json`.</p>
      <pre>{JSON.stringify({ cat1, cat2 }, null, 2)}</pre>
    </div>
  </React.StrictMode>
);
