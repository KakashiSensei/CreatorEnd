import * as  moment from "moment";
import config from './config';
import * as _ from 'lodash';
import { IQuizData } from './Definition';

namespace Helper {
    export function sortContent(data: Array<any>, n?: number) {
        let count: number = n || data.length;
        return _.chain(data)
            .sortBy((o) => {
                return moment(o.updatedAt).unix();
            })
            .reverse()
            .take(count)
            .value();
    }

    export function getLoginStatus() {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus((response: IFacebookResponce) => {
                if (response.status === 'connected') {
                    return resolve(response);
                } else if (response.status === 'not_authorized') {
                    return reject("User is not authorised");
                } else {
                    return reject("Unknown status");
                }
            });
        })
    }

    export function initFacebookSDK() {
        FB.init({
            appId: config.appID,
            xfbml: true,
            version: 'v2.9',
            status: true,
            cookie: true
        });
    }

    export function loginFacebook() {
        return new Promise((resolve, reject) => {
            FB.login((response: IFacebookResponce) => {
                if (response.status === 'connected') {
                    return resolve(response);
                } else if (response.status === 'not_authorized') {
                    return reject(response);
                } else {
                    return reject(response);
                }
            }, { scope: config.scope });
        })
    }
}

// define interfaces for facebook responce
interface IFacebookResponce {
    status: string;
}

export default Helper;