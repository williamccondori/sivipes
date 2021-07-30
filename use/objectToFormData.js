/**
 * parse object to FormData
 */
export default function (obj) {
  const formData = new FormData()

  // prevent to send empty fields
  Object.keys(obj).forEach(key => {
    if (obj[key] !== '') {
      formData.append(key, obj[key])
    }
  })

  return formData
}
