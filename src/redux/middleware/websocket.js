import { webSocketConstants, webSocketActions } from '../ducks/websockets'
import { finishLoading } from '../ducks/loading'
import { addGameServerMessage } from '../ducks/gameServer'

const socketMiddleware = () => {
  let socket = null
  const { wsConnected, wsDisconnected, wsMessage } = webSocketActions

  const onopen = store => event => {
    console.log('websocket open', event.target.url)
    store.dispatch(wsMessage({ type: 'connect' }))
    store.dispatch(wsConnected())
    store.dispatch(finishLoading())
  }

  const onclose = store => () => {
    store.dispatch(wsDisconnected())
  }

  const onmessage = store => event => {
    const messages = event.data.split('\n')
    for (var i = 0; i < messages.length - 1; ++i) {
      const message = JSON.parse(messages[i])
      store.dispatch(addGameServerMessage(message))
    }
  }

  const onerror = store => () => {
    store.dispatch(finishLoading())
    alert('Error connecting to Server')
  }

  return store => next => action => {
    const { WS_CONNECT, WS_DISCONNECT, WS_MESSAGE } = webSocketConstants

    switch (action.type) {
      case WS_CONNECT: {
        console.log('connecting')
        if (socket !== null) {
          socket.close()
        }
        const { url } = action.payload
        console.log('wsUrl:', url)
        socket = new WebSocket(url)

        socket.onmessage = onmessage(store)
        socket.onclose = onclose(store)
        socket.onopen = onopen(store)
        socket.onerror = onerror(store)
        return next(action)

      }
      case WS_DISCONNECT:
        if (socket !== null) {
          socket.close()
          socket = null
          console.log('Websocket closed')
        }
        return next(action)
      case WS_MESSAGE:
        console.log('sending a message', action.payload)
        socket.send(JSON.stringify(action.payload))
        break
      default:
        return next(action)
    }
  }
}

export default socketMiddleware()