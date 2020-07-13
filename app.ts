import { log, settings } from 'nexus'

// Neuxs Setting
settings.change({
  server: {
    port: 4664,
    startMessage: (info) => {
      settings.original.server.startMessage(info)
      log.warn('piggy back message!')
    },
    playground: true,
  },
})
