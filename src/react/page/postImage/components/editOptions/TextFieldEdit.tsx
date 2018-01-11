import * as React from "react";
import { Dispatch } from 'redux';
import { Element, State, FontStructure, Colors } from '../../postImageConstants';
import { SketchPicker } from 'react-color';
import { editText } from "../../actions";
import * as _ from "lodash";
import { Row, Col, Button, Input } from 'react-materialize';
import * as fonts from "../../../../../../font.json";
import LoadFont from "../../../../../LoadFont";

interface IProps {
    state: State
    quoteObject: Object;
    dispatch: Dispatch<{}>;
}

interface IState {
}

export default class TextFieldEdit extends React.Component<IProps, IState> {
    fontNameArray: Array<string>;
    fontSizeArray: Array<number>;

    constructor(props: IProps) {
        super(props);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleFontSizeChange = this.handleFontSizeChange.bind(this);
        this.handleFontTypeChange = this.handleFontTypeChange.bind(this);
        this.setAlignment = this.setAlignment.bind(this);

        this.fontNameArray = [];
        _.forEach(fonts["font"], (value: FontStructure, key: number) => {
            let fontName = value.name.split(",")[0].split("'").join("");
            this.fontNameArray.push(fontName);
        })

        this.fontSizeArray = [];
        for (let i = 5; i < 91; i++) {
            this.fontSizeArray.push(i);
        }

        // load the font here
        LoadFont.load();
    }

    componentDidMount() {
        this.addStyleToTextSelect();
    }

    private addStyleToTextSelect() {
        let element = document.getElementById("checkingFontType");
        let optionArray = element.parentElement.getElementsByTagName("ul")[0].children;
        let childCount = element.childElementCount;
        for (let i = 0; i < childCount; i++) {
            (optionArray[i] as any).style.fontFamily = fonts["font"][i]["name"];
        }

        // for formatting the input text
        let elementState = this.findElement(this.props.state.selectedElement);
        let fontFamily = elementState.props["fontFamily"];
        let inputElement = element.parentElement.getElementsByTagName("input")[0];
        (inputElement as any).style.fontFamily = fontFamily;
    }

    setAlignment(event) {
        let innerTextArray: Array<string> = event.target.innerText.split("_");
        let alignment = innerTextArray[innerTextArray.length - 1];
        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editText(element, { textAlign: alignment }, {}));
    }

    handleColorChange(event) {
        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editText(element, { color: event.hex }, {}));
    }

    handleFontSizeChange(event) {
        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editText(element, { fontSize: event.target.value + "px" }, {}));
    }

    handleFontTypeChange(event) {
        let element = this.findElement(this.props.state.selectedElement);
        let filteredElement = _.filter(this.fontNameArray, (value) => {
            return value.indexOf(event.target.value) !== -1;
        })

        this.props.dispatch(editText(element, { fontFamily: filteredElement[0] }, {}));
    }

    private findElement(id: string) {
        return _.find(this.props.state.components, { id: id });
    }

    render() {
        let colors = Colors;
        let element = this.findElement(this.props.state.selectedElement);
        let color = (element.props as any).color;

        let fontSize = (element.props as any).fontSize.replace("px", "");
        let fontName: string = (element.props as any).fontFamily;

        // workaround because on click not working on select tag
        setTimeout(() => {
            this.addStyleToTextSelect();
        }, 100);

        return (
            <div>
                <Row>
                    <Col s={4}>
                        <Input s={12} type='select' label="Size" value={fontSize} onChange={this.handleFontSizeChange}>
                            {this.fontSizeArray.map((value, key) => {
                                return <option key={key} value={value}>{value + "px"}</option>
                            })}
                        </Input>
                    </Col>

                    <Col s={8}>
                        <Input style={{ fontFamily: fontName }} s={12} id="checkingFontType" type='select' label="Type" value={fontName} onChange={this.handleFontTypeChange}>
                            {fonts["font"].map((value: FontStructure, key) => {
                                let fontName = value.name.split(",")[0].split("'").join("");
                                this.fontNameArray.push(fontName);
                                return <option key={key} value={fontName}>{fontName}</option>
                            })}
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Button floating className='baseMargin backgroundColor' waves='light' icon='format_align_left' onClick={this.setAlignment} />
                    <Button floating className='baseMargin backgroundColor' waves='light' icon='format_align_center' onClick={this.setAlignment} />
                    <Button floating className='baseMargin backgroundColor' waves='light' icon='format_align_right' onClick={this.setAlignment} />
                </Row>
                <Row>
                    <SketchPicker color={color} colors={colors} onChangeComplete={this.handleColorChange} />
                </Row>
            </div>
        )
    }
}