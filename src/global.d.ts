declare namespace FB {
    function getLoginStatus(cb: Function): void;
    function init(params: Object): void;
    function login(cb: Function, scope: Object): void;
    function api(params: string, cb:Function): void;
    function logout(res: Object): void;
}

declare module 'react-materialize';