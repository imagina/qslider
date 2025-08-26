const moduleName = 'islider';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  sliders: `${urlBase}/sliders`,
  slides: `${urlBase}/slides`,
  orderSlides: `${urlBase}/sliders/order-slides`
}
