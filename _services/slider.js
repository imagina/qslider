import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import http from "axios"

export default {
  /**
   * Get Slider by ID
   * @param ID
   */
  show(id){
    return new Promise((resolve, reject) => {
      http.get(config('api.api_url') + '/slider/'+id)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject([]);
        })
    });
  },

}
