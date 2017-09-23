import { IUserDetail } from "./Definition";

namespace Auth {
    let Authenticate: boolean = false;
    let accessToken: string;
    let userDetail:IUserDetail;

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
}

export default Auth;