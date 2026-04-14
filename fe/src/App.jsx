import React from 'react'
import { AuthProvider } from './features/auth/auth.context'
import { MovieContextProvider } from './features/movie/movie.context'
import { AppRoutes } from './AppRoutes'


const App = () => {
  return (
    <AuthProvider>
      <MovieContextProvider>
        <AppRoutes/>
      </MovieContextProvider>
    </AuthProvider>
  )
}

export default App