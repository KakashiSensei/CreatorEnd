import * as React from "react";
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import ImagePostRow from "../components/creatorComponent/ImagePostRow";
import { IImagePostData } from "../../Definition";

interface IProps {
    data: IImagePostData[];
    deleteCallback: Function;
}

interface IState {
}

export default class ImageDisplayTable extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <Table>
                <thead>
                    <tr>
                        <th data-field="title">Question</th>
                        <th data-field="updatedOn">Updated On</th>
                        <th data-field="buttons"></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.data && this.props.data.map((element, index) => {
                        return (
                            <ImagePostRow deleteCallback={this.props.deleteCallback} element={element} key={element.updatedAt} />
                        )
                    })}
                </tbody>
            </Table>
        </div>)
    }
}