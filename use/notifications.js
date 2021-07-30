import { Notification } from 'element-ui'

export const $_notify_success = (message, title = 'Correcto') => {
  Notification.success({
    title,
    message,
    type: 'success'
  })
}
export const $_notify_info = (message, title = 'Atención') => {
  Notification.info({
    title,
    message,
    type: 'info'
  })
}
export const $_notify_error = (message, title = 'Ha ocurrido un error') => {
  Notification.error({
    title,
    message,
    type: 'error'
  })
}
