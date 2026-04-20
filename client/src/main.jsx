import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { Provider } from 'react-redux'
import { store } from './App/store'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkProvider appearance={{ Variable: { colorPrimary: '#4f46e5' } }}>
      <Provider store={store}>
        <App />
      </Provider>
    </ClerkProvider>
  </BrowserRouter>
)
