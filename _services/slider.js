import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import http from "axios"

export default {

  /**
   * Get Categories by parameters
   */
  index(parameters) {
    parameters ? true : parameters = []

    return new Promise((resolve, reject) => {
      http.get(config('api.api_url') + '/slide',{params: parameters})
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject([]);
        })
    });
  },


  /**
   * Get Slider by ID
   * @param ID
   */
  show(id){
    return new Promise((resolve, reject) => {
      http.get(config('api.api_url') + '/slide/'+id)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject([]);
        })
    });
  },

}
