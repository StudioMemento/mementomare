import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

/** Per-route static markup: the story and links arrive before client effects. */
export function render(path: string) {
 return renderToString(<StaticRouter location={path}><App /></StaticRouter>);
}
