import express from 'express'
import cors from 'cors'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from '../store'
import { renderToString } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import serialize from 'serialize-javascript'
import App from '../shared/App'
import routes from '../shared/routes'
import api from './api'
const app = express()

app.use(cors())
app.use(express.static('public'))
app.use('/api', api)
app.get('*', (req, res, next) => {
  // Create a new Redux store instance
  const initialState = {
    sample: {}
  }
  const store = configureStore(initialState)
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}
  if (activeRoute.component && activeRoute.component.fetchData) {
    activeRoute.component.fetchData(store).then(data => {
      const context = { data }

      const markup = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      )

      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RR</title>
          <script src="/bundle.js" defer></script>
          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
          <script>window.__INITIAL_STATE__ = ${serialize(store.getState())}</script>
        </head>

        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
    })
  }
})

app.listen(3000, () => {
  console.log(`Server is listening on port: 3000`)
})

/*
  1) Just get shared App rendering to string on server then taking over on client.
  2) Pass data to <App /> on server. Show diff. Add data to window then pick it up on the client too.
  3) Instead of static data move to dynamic data (github gists)
  4) add in routing.
*/
