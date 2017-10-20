import * as React from "react";
import PageComp from "./pageListComp/PageComp";
import { Row } from 'react-materialize';
import {IPageDetail} from '../../Definition';

interface IProps {
    pageList: Array<IPageDetail>;
    onPageSelect: Function;
}

interface IState {
}

export default class PageList extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Row>
                {this.props.pageList.map((element: IPageDetail, index: number) => {
                    return <PageComp key={index} element={element} onPageSelect={this.props.onPageSelect}/>
                })}
            </Row>
        );
    }
}