import * as React from "react";
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import VideoRow from "../components/creatorComponent/VideoRow";
import { IVideoData } from "../../Definition";

interface IProps {
    data: IVideoData[];
    deleteCallback: Function;
}

interface IState {
    title: string;
    thumbnail: string;
}
export default class VideoDisplayTable extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th data-field="title">Question</th>
                            <th data-field="updatedOn">Updated On</th>
                            <th data-field="buttons"></th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        {this.props.data && this.props.data.map((element, index) => {
                            return (
                                <VideoRow deleteCallback={this.props.deleteCallback} element={element} key={element.updatedAt} />
                            )
                        })}
                    </tbody> */}
                </Table>
            </div>
        )
    }
}