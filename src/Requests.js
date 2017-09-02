import config from "./config";
import * as Auth from "./Auth";
import * as _ from "lodash";

let addAccessKey = (headerObject) => {
    let accessToken = Auth.getAccessToken();
    headerObject.Authorization = "Bearer " + accessToken;
    return headerObject;
}

exports.getAllQuizQuestion = () => {
    let url = config.restAPI + "/api/game";
    let headerObject = {};
    addAccessKey(headerObject);
    return fetch(url, {
        method: 'GET',
        headers: headerObject
    })
        .then(res => res.json())
}

exports.getAllVideo = () => {
    let url = config.restAPI + "/api/video";
    let headerObject = {};
    addAccessKey(headerObject);
    return fetch(url, {
        method: 'GET',
        headers: headerObject
    })
        .then(res => res.json())
}

exports.getVideoDetails = (videoID) => {
    let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=AIzaSyB7Zk1X9GB5MdxnRSxVWmdv3MwSbHU9RHA`;
    return fetch(url, {
        method: 'GET'
    })
        .then(res => res.json())
}

exports.resizeImageRequest = (postData) => {
    let url = config.restAPI + "/api/resizeImage";
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: headerObject
    }).then(res => res.json())
}

exports.addLoginInformation = (postData) => {
    let url = config.restAPI + "/api/account";
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: headerObject
    }).then(res => res.json())
}

exports.getAccountDetails = (accessToken) => {
    let url = "https://graph.facebook.com/me?fields=id,name,about,age_range,birthday,email,education,cover,hometown,gender,first_name,last_name,middle_name,relationship_status,languages&access_token=" + accessToken;
    let headerObject = {};
    addAccessKey(headerObject);
    return fetch(url, {
        method: 'GET',
        headers: headerObject
    })
        .then(res => res.json())
}

exports.addNewQuiz = (data) => {
    let method = 'POST';
    let url = config.restAPI + "/api/game";
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: headerObject
    })
        .then(res => res.json())
}

exports.updateNewQuestion = (data, questionID) => {
    let method = 'PUT';
    let url = config.restAPI + "/api/game/" + questionID;
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: headerObject
    })
        .then(res => res.json())
}

exports.getQuestions = (questionID) => {
    let url = config.restAPI + "/api/game/" + questionID;
    let headerObject = {};
    addAccessKey(headerObject);
    return fetch(url, {
        method: 'GET',
        headers: headerObject
    })
        .then(res => res.json())
}

exports.deleteVideo = (questionID) => {
    let url = config.restAPI + "/api/video/" + questionID;
    let headerObject = {};
    addAccessKey(headerObject);
    return fetch(url, {
        method: 'DELETE',
        headers: headerObject
    })
        .then(res => res.json());
}

exports.deleteQuiz = (questionID) => {
    let url = config.restAPI + "/api/game/" + questionID;
    let headerObject = {};
    addAccessKey(headerObject);
    return fetch(url, {
        method: 'DELETE',
        headers: headerObject
    })
        .then(res => res.json())
}

exports.addNewVideo = (data) => {
    let url = config.restAPI + "/api/video";
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: headerObject
    })
        .then(res => res.json())
}

exports.updateNewVideo = (data, videoID) => {
    let url = config.restAPI + "/api/video/" + videoID;
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: headerObject
    })
        .then(res => res.json())
}

exports.getVideo = (videoID) => {
    let url = config.restAPI + "/api/video/" + videoID;
    let headerObject = {};
    addAccessKey(headerObject);
    return fetch(url, {
        method: 'GET',
        headers: headerObject
    })
        .then(res => res.json())
}

exports.getFacebookData = (postData) => {
    let url = `${config.restAPI}/api/facebook`;
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: headerObject
    })
        .then(res => res.json())
}

exports.changeStatus = (postData) => {
    let url = `${config.restAPI}/api/status`;
    let headerObject = {};
    addAccessKey(headerObject);
    headerObject = _.assign(headerObject, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: headerObject
    })
        .then(res => res.json())
}