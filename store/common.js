export const state = () => ({
  image : {
    name : ""
  }
})
export const actions = {
}
export const mutations = {
  increment (state, image_name) {
    state.image.name = image_name
  }
}