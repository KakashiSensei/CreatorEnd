import * as React from "react";
import { Input, Row, Col, Button, Navbar, NavItem, Preloader } from 'react-materialize';
import Requests from '../../Requests';
import * as _ from 'lodash';
import { IResizeImageRequestData } from '../../Requests';
import { history } from '../../Routes';
import { IImagePostData, IUserDetail } from '../../Definition';
import Auth from '../../Auth';

interface IProps {
}

interface IState {
    imageArray: string[];
}
export default class ImagePage extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            imageArray: [],
        }

        this.onIntroImageUploaded = this.onIntroImageUploaded.bind(this);
        this.submitClicked = this.submitClicked.bind(this);
    }

    onIntroImageUploaded(e) {
        let files = e.currentTarget.files;
        _.forEach(files, (value: Blob, key) => {
            let reader = new FileReader();
            reader.onload = (event) => {
                let data = (event.target as any).result.replace("data:" + value.type + ";base64,", '');
                let postData: IResizeImageRequestData = {
                    data: data,
                    facebookPost: true
                };
                Requests.resizeImageRequest(postData)
                    .then((data) => {
                        let imageArray = this.state.imageArray;
                        imageArray.push(data.location);
                        this.setState({
                            imageArray: imageArray
                        })
                    });
            }
            reader.readAsDataURL(value);
        })
    }

    submitClicked(e) {
        // let size = this.state.imageArray.length;
        let promiseArray: Promise<void>[] = [];
        let userDetail: IUserDetail = Auth.getUserDetail();
        _.forEach(this.state.imageArray, (value, key) => {
            let imageData: IImagePostData = {
                imageUrl: value,
                createdBy: userDetail.email
            }
            promiseArray.push(Requests.addNewImage(imageData));
        })

        Promise.all(promiseArray).then(() => {
            let location = "/";
            history.push(location);
        })
    }

    render() {
        return (
            <Row>
                <Row>
                    <Col s={4}>
                        <input multiple type="file" id="introFileSelected" ref="introFileSelected" style={{ display: "none", alignSelf: "flex-end" }} onChange={this.onIntroImageUploaded} />
                        <br />
                    </Col>
                </Row>
                <Row>
                    <Col s={4}>
                        <span><Button waves='light' onClick={() => { return (this.refs.introFileSelected as any).click() }}>Browse</Button></span>
                    </Col>
                </Row>
                {this.state.imageArray && this.state.imageArray.map((element, index) => {
                    return (
                        <Row key={index}>
                            <Col s={4}>
                                <img src={element} alt="Smiley face" height="100" width="100" />
                            </Col>
                        </Row>
                    )
                })}
                <Row>
                    <Col s={4}>
                        <Button waves='light' onClick={this.submitClicked}>submit</Button>
                    </Col>
                </Row>
            </Row>
        )
    }
}