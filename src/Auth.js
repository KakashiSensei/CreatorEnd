let Authenticate = false;
let accessToken = null;
let userDetail = {};

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(accessTok) {
    accessToken = accessTok;
}

export function isAuthenticated() {
    return Authenticate;
}

export function setAuthentication(value) {
    Authenticate = value
}

export function getUserDetail() {
    return userDetail;
}

export function setUserDetail(userDet){
    userDetail = userDet;
}