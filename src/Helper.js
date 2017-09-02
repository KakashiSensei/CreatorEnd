import moment from "moment";
import config from './config';

exports.getSelectedContent = (data, n) => {
    let count = n || data.length;
    return _.chain(data)
        .sortBy((o) => {
            return moment(o.updatedAt).unix();
        })
        .reverse()
        .take(count)
        .value();
}

exports.initFacebookSDK = () => {
    FB.init({
        appId: config.appID,
        xfbml: true,
        version: 'v2.9',
        status: true,
        cookie: true
    });
}

exports.getLoginStatus = () => {
    return new Promise((resolve, reject) => {
        FB.getLoginStatus((response) => {
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

exports.loginFacebook = () => {
    return new Promise((resolve, reject) => {
        FB.login((response) => {
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

exports.status = {
    DEVELOPING: "Developing",
    IN_REVIEW: "In Review",
    APPROVED: "Approved",
    POSTED: "Posted"
}