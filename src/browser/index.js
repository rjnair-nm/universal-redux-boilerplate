import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../store'
import App from '../shared/App'
import { BrowserRouter } from 'react-router-dom'

const preloadedState = window.__INITIAL_STATE__
delete window.__PRELOADED_STATE__
const store = configureStore(preloadedState)

hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
)
