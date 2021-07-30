export default $axios => resource => ({
  get: params => $axios.$get(`${resource}/`, { params }),

  create: data => $axios.$post(`${resource}/`, data),

  update: data => $axios.$put(`${resource}/${data.get('id')}/`, data),

  delete: id => $axios.$delete(`${resource}/${id}/`),

  //polygons
  getPolygons: params => $axios.$get(`${resource}/`, { params }),

  // satelital_image
  search: data => $axios.$post(`${resource}/search/`, data),
  getBands: () => $axios.$get(`${resource}/band/`),
  getById: id => $axios.$get(`${resource}/${id}/`),

  getSatelitalImages: params => $axios.$get(`${resource}/project/`, { params }),

  // project
  addToProject: data => $axios.$post(`${resource}/satelital_image/`, data),

  // upload shape file /portal
  getObjGeoJSON: data => $axios.$post(`${resource}/upload/`, data),
  getWMSCapabilities: data => $axios.$post(`${resource}/wms_capabilities/`, data),

})
