
// status for the quiz
export enum status {
    DEVELOPING = "Developing",
    IN_REVIEW = "In Review",
    APPROVED = "Approved",
    POSTED = "Posted"
}

export interface IVideoData {
    _id?: number
    videoID: string;
    status?: status;
    createdAt?: number;
    updatedAt?: number;
}

export interface IImagePostData {
    _id?: number;
    imageUrl: string;
    createdBy: string;
    quote: string;
    author: string;
    dom: Object;
    status?: status;
    postTime?: number;
    createdAt?: number;
    updatedAt?: number;
}

export interface IQuizData {
    _id?: number;
    title: string;
    description: string;
    introImage: string;
    outputText: string;
    dom: string;
    status?: status;
    createdBy: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface IUserDetail {
    name: string;
    email: string;
    facebookID: number;
    type?: string;
}

export interface IPageDetail {
    access_token: string,
    category: string,
    id: string,
    name: string,
    perms: Array<String>
}