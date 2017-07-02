import config from "./config";

exports.getAllQuizQuestion = () => {
    let url = config.restAPI + "/api/game";
    return fetch(url, { method: 'GET' })
        .then(res => res.json())
}

exports.getAllVideo = () => {
    let url = config.restAPI + "/api/video";
    return fetch(url, { method: 'GET' })
        .then(res => res.json())
}

exports.getVideoDetails = (videoID) => {
    let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=AIzaSyB7Zk1X9GB5MdxnRSxVWmdv3MwSbHU9RHA`;
    console.log(url);
    return fetch(url, { method: 'GET' })
        .then(res => res.json())
}