import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ShoppingListProvider } from './context/ShoppingListContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <ShoppingListProvider>
          <App />
        </ShoppingListProvider>
      </FavoritesProvider>
    </AuthProvider>
  </StrictMode>,
)
