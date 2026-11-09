import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Шрифты: Fraunces — заголовки, Manrope — текст, Lora — кириллица в заголовках
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/lora/cyrillic-400.css';
import '@fontsource/lora/cyrillic-400-italic.css';
import '@fontsource/lora/cyrillic-500.css';
import '@fontsource/lora/cyrillic-600.css';

import './styles/variables.css';
import './styles/global.css';

import App from './App';
import { store } from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
