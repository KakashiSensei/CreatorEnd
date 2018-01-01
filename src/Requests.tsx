import config from "./config";
import Auth from "./Auth";
import * as _ from "lodash";
import { IUserDetail, IQuizData, IVideoData, IImagePostData } from "./Definition";

export interface IHeaderObject {
    Authorization: string;
    Accept: string;
}

export interface IResizeImageRequestData {
    url?: string;
    data?: string;
    maxWidth?: string;
    maxHeight?: string;
    width?: string;
    height?: string;
    type?: string;
    facebookPost?: boolean;
}

export interface IFacebookRequestData {
    id: number;
    accessToken: string;
}

namespace Requests {
    let addAccessKey = (headerObject: IHeaderObject) => {
        let accessToken = Auth.getAccessToken();
        headerObject.Authorization = "Bearer " + accessToken;
        return headerObject;
    }

    export function getAllQuizQuestion() {
        let url = config.restAPI + "/api/game";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function resizeImageRequest(postData: IResizeImageRequestData) {
        let url = config.restAPI + "/api/resizeImage";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: new Headers(headerObject)
        }).then(res => res.json())
    }

    export function addLoginInformation(postData: IUserDetail) {
        let url = config.restAPI + "/api/account";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: new Headers(headerObject)
        }).then(res => res.json())
    }

    export function getAccountDetails(accessToken: string) {
        let url = "https://graph.facebook.com/me?fields=id,name,about,age_range,birthday,email,education,cover,hometown,gender,first_name,last_name,middle_name,relationship_status,languages&access_token=" + accessToken;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function addNewQuiz(data: IQuizData) {
        let method = 'POST';
        let url = config.restAPI + "/api/game";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function updateNewQuestion(data: IQuizData, questionID: string) {
        let method = 'PUT';
        let url = config.restAPI + "/api/game/" + questionID;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function getQuestions(questionID: string) {
        let url = config.restAPI + "/api/game/" + questionID;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function deleteQuiz(questionID: string) {
        let url = config.restAPI + "/api/game/" + questionID;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'DELETE',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function getAllVideo() {
        let url = config.restAPI + "/api/video";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function getVideoDetails(videoID: string) {
        let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=AIzaSyB7Zk1X9GB5MdxnRSxVWmdv3MwSbHU9RHA`;
        return fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
    }

    export function addNewVideo(data: IVideoData) {
        let url = config.restAPI + "/api/video";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function updateNewVideo(data: IVideoData, videoID: string) {
        let url = config.restAPI + "/api/video/" + videoID;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function getVideo(videoID: string) {
        let url = config.restAPI + "/api/video/" + videoID;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function deleteVideo(questionID: string) {
        let url = config.restAPI + "/api/video/" + questionID;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'DELETE',
            headers: new Headers(headerObject)
        })
            .then(res => res.json());
    }

    export function addNewImage(data: IImagePostData) {
        let url = config.restAPI + "/api/postImage";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function getAllImagePost() {
        let url = config.restAPI + "/api/postImage";
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function deleteImage(imageID: string) {
        let url = config.restAPI + "/api/postImage/" + imageID;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'DELETE',
            headers: new Headers(headerObject)
        })
            .then(res => res.json());
    }

    export function getFacebookData(postData) {
        let url = `${config.restAPI}/api/facebook`;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(postData),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function changeStatus(postData) {
        let url = `${config.restAPI}/api/status`;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(postData),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function pageList(accessToken: string) {
        let url = "https://graph.facebook.com/me/accounts?access_token=" + accessToken;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function postOnFacebook(postData, accessToken: string): Promise<{}> {
        let url = "https://graph.facebook.com/me/photos?access_token=" + accessToken;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function getLatestPostTime(): Promise<{}> {
        let url = `${config.restAPI}/api/postImage/lastTime`;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        return fetch(url, {
            method: 'GET',
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function makeQuoteImage(dom): Promise<{}> {
        let url = `${config.restAPI}/api/editableQuote/makeImage`;
        let headerObject = {};
        addAccessKey(headerObject as IHeaderObject);
        headerObject = _.assign(headerObject, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(dom),
            headers: new Headers(headerObject)
        })
            .then(res => res.json())
    }

    export function getNewQuote(): Promise<{}> {
        // let url = 'https://quotes.rest/qod';
        // let headerObject = {};
        // headerObject = _.assign(headerObject, {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        // });
        // return fetch(url, {
        //     method: 'GET'
        // })
        //     .then(res => res.json())
        return new Promise((resolve, reject) => {
            let url = "http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=jsonp&lang=en&jsonp=?";
            let getQuote = function (data) {
                resolve(data);
            };
            (window as any).$.getJSON(url, getQuote, 'jsonp');
        })
    }

    export function getCorrespondingImage(qs: Array<string>): Promise<{}> {
        let queryString = qs.reduce((preValue, curValue) => {
            if (!preValue) {
                return curValue;
            }
            return `${preValue} + ${curValue}`;
        }, "");
        
        let width = 1024;
        let height = 768;
        let url = `https://pixabay.com/api?key=4392968-f9373bdb7eda6ac0964fe8d63&q=${queryString}&orientation=horizontal&safesearch=true&min_width=${width}&min_height=${height}`;
        return fetch(url, {
            method: 'GET'
        }).then(res => res.json())
    }
}

export default Requests;

