import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();
app.get('/', (c) => {
  console.log('env keys:', Object.keys(c.env || {}));
  return c.text('Hello!');
});

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Listening');
  fetch('http://localhost:3000').then(res => res.text()).then(t => {
    console.log(t);
    process.exit(0);
  });
});
