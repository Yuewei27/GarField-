import Vue from 'vue'
import { Toast } from 'vant'

Vue.use(Toast)

class ValidForm{

    constructor(){}

    valid(obj){
        for(let key in obj){
            if (!obj[key].reg.test(obj[key].value)) {
                // 

                Toast(obj[key].errorMsg)

                return false;
            }
        }
        return true;
    }
}
export const validForm = new ValidForm();