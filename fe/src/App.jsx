import React from 'react'
import { AuthProvider } from './features/auth/auth.context'
import { MovieContextProvider } from './features/movie/movie.context'
import { AppRoutes } from './AppRoutes'
import { WatchHistoryContextProvider } from './features/watchHistory/watchHistory.context'


const App = () => {
  return (
    <AuthProvider>
      <MovieContextProvider>
        <WatchHistoryContextProvider>
          <AppRoutes/>
        </WatchHistoryContextProvider>
      </MovieContextProvider>
    </AuthProvider>
  )
}

export default App