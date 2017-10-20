import { IUserDetail, IPageDetail } from "./Definition";

namespace Auth {
    let Authenticate: boolean = false;
    let accessToken: string;
    let userDetail: IUserDetail;
    let pageDetail: IPageDetail;
    let pageAccessToken: string;

    export function getAccessToken(): string {
        return accessToken;
    }

    export function setAccessToken(accessTok: string): void {
        accessToken = accessTok;
    }


    export function isAuthenticated(): boolean {
        return Authenticate;
    }

    export function setAuthentication(value: boolean): void {
        Authenticate = value
    }

    export function getUserDetail(): IUserDetail {
        return userDetail;
    }

    export function setUserDetail(userDet: IUserDetail) {
        userDetail = userDet;
    }

    export function getPageAccessToken(): string {
        return pageAccessToken;
    }

    export function setPageAccessToken(accessTok: string): void {
        pageAccessToken = accessTok;
    }

    export function getPageDetail() {

    }

    export function setPageDetail() {

    }
}

export default Auth;