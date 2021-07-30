export const required = (the, field) => [
  {
    required: true,
    message: `${the} ${field} es requerid${the === 'la' ? 'a' : 'o'}`
  }
]
