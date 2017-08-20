let Authenticate = false;
export function isAuthenticated() {
    return Authenticate;
}

export function setAuthentication(value) {
    Authenticate = value
}