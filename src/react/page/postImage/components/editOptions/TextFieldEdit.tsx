import * as React from "react";
import { Dispatch } from 'redux';
import { Element, State, FontStructure, Colors } from '../../postImageConstants';
import { editText } from "../../actions";
import * as _ from "lodash";
import { Row, Col, Button, Input } from 'react-materialize';
import * as fonts from "../../../../../font.json";
import LoadFont from "../../../../../LoadFont";
import ColorSwatch from "../element/ColorSwatch";

interface IProps {
    state: State
    quoteObject: Object;
    dispatch: Dispatch<{}>;
}

interface IState {
    shadowColor: boolean;
    colorSwatch: boolean;
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
        this.setFontWeight = this.setFontWeight.bind(this);
        this.setFontStyle = this.setFontStyle.bind(this);
        this.addShadow = this.addShadow.bind(this);
        this.shadowColorChange = this.shadowColorChange.bind(this);

        this.state = {
            shadowColor: false,
            colorSwatch: false
        }

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
        let element = this.findElement(this.props.state.selectedElement);
    }

    private shadowColorChange(event) {
        let element = this.findElement(this.props.state.selectedElement);
        let shadow = element.props['textShadow'];
        if (shadow) {
            let tmp: string[] = shadow.split(" ");
            tmp[tmp.length - 1] = event.hex;
            this.props.dispatch(editText(element, { textShadow: tmp.join(" ") }, {}));
        }
    }

    private addShadow() {
        // text-shadow: 2px 2px #ff0000;
        let element = this.findElement(this.props.state.selectedElement);
        let shadow = element.props['textShadow'] ? null : "2px 2px #000000";
        this.props.dispatch(editText(element, { textShadow: shadow }, {}));
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

    private setFontWeight(event) {
        let element = this.findElement(this.props.state.selectedElement);
        let fontWeight = element.props['fontWeight'] === "bold" ? "normal" : "bold";
        this.props.dispatch(editText(element, { fontWeight: fontWeight }, {}));
    }

    private setFontStyle(event) {
        let element = this.findElement(this.props.state.selectedElement);
        let fontStyle = element.props['fontStyle'] === "italic" ? "normal" : "italic";
        this.props.dispatch(editText(element, { fontStyle: fontStyle }, {}));
    }

    private setAlignment(event) {
        let innerTextArray: Array<string> = event.target.innerText.split("_");
        let alignment = innerTextArray[innerTextArray.length - 1];
        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editText(element, { textAlign: alignment }, {}));
    }

    private handleColorChange(event) {
        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editText(element, { color: event.hex }, {}));
    }

    private handleFontSizeChange(event) {
        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editText(element, { fontSize: event.target.value + "px" }, {}));
    }

    private handleFontTypeChange(event) {
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

        // adding color picker below the button
        let colorPicker;
        if (this.state.shadowColor) {
            colorPicker = <ColorSwatch color={color} callback={() => {
                this.setState({
                    shadowColor: false
                })
            }} onChangeComplete={this.shadowColorChange} />
        } else {
            colorPicker = <div></div>
        }

        let swatchColorPicker;
        if (this.state.colorSwatch) {
            swatchColorPicker = <ColorSwatch color={color} callback={() => {
                this.setState({
                    colorSwatch: false
                })
            }} onChangeComplete={this.handleColorChange} />
        } else {
            swatchColorPicker = <div></div>
        }

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
                        <Input style={{ fontFamily: fontName }} s={12} id="checkingFontType" type='select' label="Type" value={fontName.split(",")[0].split("'").join("")} onChange={this.handleFontTypeChange}>
                            {fonts["font"].map((value: FontStructure, key) => {
                                let fontName = value.name.split(",")[0].split("'").join("");
                                this.fontNameArray.push(fontName);
                                return <option key={key} value={fontName}>{fontName}</option>
                            })}
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Col s={6}>
                        <Button floating className='baseMargin backgroundColor' waves='light' icon='format_align_left' onClick={this.setAlignment} />
                        <Button floating className='baseMargin backgroundColor' waves='light' icon='format_align_center' onClick={this.setAlignment} />
                        <Button floating className='baseMargin backgroundColor' waves='light' icon='format_align_right' onClick={this.setAlignment} />
                    </Col>
                    <Col s={6}>
                        <Button floating className='baseMargin backgroundColor' waves='light' icon='format_bold' onClick={this.setFontWeight} />
                        <Button floating className='baseMargin backgroundColor' waves='light' icon='format_italic' onClick={this.setFontStyle} />
                    </Col>
                </Row>
                <Row>
                    <Col s={3}>
                        <Button waves='light' onClick={this.addShadow}>Shadow</Button>
                    </Col>
                    <Col s={3}>
                        <Row>
                            <Button floating className='backgroundColor' waves='light' icon='format_color_fill' onClick={() => {
                                this.setState({
                                    shadowColor: !this.state.shadowColor
                                })
                            }} />
                        </Row>
                        {colorPicker}
                    </Col>
                    <Col s={6}>
                        <Row>
                            <Button floating className='backgroundColor' waves='light' icon='format_color_fill' onClick={() => {
                                this.setState({
                                    colorSwatch: !this.state.colorSwatch
                                })
                            }} />
                        </Row>
                        <Row>
                            {swatchColorPicker}
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}