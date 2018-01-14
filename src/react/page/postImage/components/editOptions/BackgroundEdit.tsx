import * as React from "react";
import { Dispatch } from 'redux';
import { Element, State, FontStructure, Colors } from '../../postImageConstants';
import { Row, Col, Button, Input, Card, CardTitle } from 'react-materialize';
import * as _ from "lodash";
import Requests from '../../../../../Requests';
import { editBackground } from "../../actions";
import * as keywordExtractor from "keyword-extractor";
import { SketchPicker } from 'react-color';
import Slider from 'react-rangeslider';
// To include the default styles
import 'react-rangeslider/lib/index.css'

interface CheckboxStatus {
    name: string;
    checked: boolean;
}

interface IProps {
    state: State;
    quoteObject: Object
    dispatch: Dispatch<{}>;
}

interface IState {
    tags: Array<CheckboxStatus>;
    imageArray: Array<Object>;
    filterValue: Array<Object>;
}

export default class BackgroundEdit extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.tagChanged = this.tagChanged.bind(this);
        this.onImageSelected = this.onImageSelected.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.applyTint = this.applyTint.bind(this);
        let filterArray = [
            { name: "grayscale", displayName: "Grey Scale", startValue: 0, endValue: 100, value: 0, suffix: "", steps: 1 },
            { name: "blur", displayName: "Blur", startValue: 0, endValue: 10, value: 0, suffix: "px", steps: 1 },
            { name: "brightness", displayName: "Brightness", startValue: 1, endValue: 10, value: 1, suffix: "", steps: 1 },
            { name: "contrast", displayName: "Contrast", startValue: 1, endValue: 10, value: 1, suffix: "", steps: 1 },
            { name: "saturate", displayName: "Saturate", startValue: 0, endValue: 1, value: 1, suffix: "", steps: 0.1 },
            { name: "sepia", displayName: "Sepai", startValue: 0, endValue: 1, value: 0, suffix: "", steps: 0.1 },
            { name: "hue-rotate", displayName: "Hue Rotate", startValue: 0, endValue: 360, value: 0, suffix: "deg" },
            { name: "invert", displayName: "Invert", startValue: 0, endValue: 1, value: 0, suffix: "", steps: 0.1 },
            { name: "opacity", displayName: "Opacity", startValue: 0, endValue: 1, value: 1, suffix: "", steps: 0.1 },
        ];
        this.state = {
            tags: [],
            imageArray: [],
            filterValue: filterArray
        }
    }

    componentDidMount() {
        let quote = this.props.quoteObject['quoteText'];
        let queryString: Array<string> = keywordExtractor.extract(quote, {
            language: "english",
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: true
        })
        let mapString: Array<CheckboxStatus> = queryString.map((value, key) => {
            return { name: value, checked: false }
        })
        mapString.unshift({ name: "nature", checked: true });

        // set the state here
        this.setState({
            tags: mapString
        })

        // change the filter value depending opon the state
        let element = this.findElement(this.props.state.selectedElement);
        let filterElement: string = element.props["filter"];
        let filterObject: Array<string> = filterElement.split(" ");
        let filterArray = [...this.state.filterValue];
        for (let i = 0; i < filterObject.length - 1; i++) {
            let singleFilter: string = filterObject[i];
            singleFilter = singleFilter.replace("(", " ");
            singleFilter = singleFilter.replace(")", "");
            let filterSplit: Array<string> = singleFilter.split(" ");
            let filterName: string = filterSplit[0];
            let filterValue: string = filterSplit[1].replace("px", "").replace("deg", "");
            let index = _.findIndex(filterArray, (value, key) => {
                return value["name"] === filterName;
            })
            filterArray[index]["value"] = +filterValue;
        }

        // set the filter value here
        this.setState({
            filterValue: filterArray
        })
    }

    applyTint(event) {
        let flag = event.target.checked;
        let element = this.findElement(this.props.state.selectedElement);
        if (flag) {
            this.props.dispatch(editBackground(element, { "backgroundBlendMode": "multiply" }, {}));
        } else {
            this.props.dispatch(editBackground(element, { "backgroundBlendMode": "normal" }, {}));
        }
    }

    handleOnChange(value, event) {
        let filterName = event.currentTarget && event.currentTarget.parentElement && event.currentTarget.parentElement.parentElement && event.currentTarget.parentElement.parentElement.id;
        if (!filterName)
            return;
        let indexValue = this.state.filterValue.indexOf(_.find(this.state.filterValue, (value, key) => {
            return filterName === value["name"];
        }))

        let newFilterState = [...this.state.filterValue];
        newFilterState[indexValue]["value"] = value;
        this.setState({
            filterValue: newFilterState,
        })
        this.onFilterApply(newFilterState);
    }

    handleColorChange(event) {
        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editBackground(element, { backgroundColor: event.hex }, {}));
    }

    onFilterApply(filterValue) {
        let filterText = "";
        for (let i = 0; i < filterValue.length; i++) {
            let childID = filterValue[i]["name"];
            let value = filterValue[i]["value"];
            let suffix = filterValue[i]["suffix"];
            filterText += `${childID}(${value}${suffix}) `;
        }

        let element = this.findElement(this.props.state.selectedElement);
        this.props.dispatch(editBackground(element, {
            filter: filterText,
            WebkitFilter: filterText,
            MozFilter: filterText,
            msFilter: filterText,
            OFilter: filterText
        }, {}));
    }

    onImageSelected(event) {
        let imageSelect: string = event.target.src;
        let imageObject = _.filter(this.state.imageArray, (value, key) => {
            return value["previewURL"] === imageSelect;
        })
        let elementState = this.findElement(this.props.state.selectedElement);
        let props = { backgroundImage: `url("${imageObject[0]["webformatURL"]}")` }
        this.props.dispatch(editBackground(elementState, props));
    }

    tagChanged(event) {
        let target = event.target;
        let index = +target.name;
        let checked: boolean = event.target.checked;

        this.state.tags[index].checked = checked;
        this.setState({
            tags: this.state.tags
        }, () => {
            this.getCorrespondingImages(this.state.tags).then((result: Array<Object>) => {
                this.setState({
                    imageArray: result["hits"]
                })
            })
        })
    }

    private findElement(id: string) {
        return _.find(this.props.state.components, { id: id });
    }

    getCorrespondingImages(qs: Array<CheckboxStatus>): Promise<{}> {
        let quesryString: Array<CheckboxStatus> = qs.filter((value, key) => {
            return value.checked;
        })
        let nameString: Array<string> = quesryString.map((value, key) => {
            return value.name;
        })
        return Requests.getCorrespondingImage(nameString)
    }

    render() {
        let colors = Colors;
        let elementState = this.findElement(this.props.state.selectedElement);
        let color = elementState.props["backgroundColor"];

        return (
            <div>
                <Row>
                    {this.state.tags.map((value, key) => {
                        let defaultValue = value.checked ? "checked" : undefined;
                        return <Input key={key} name={key.toString()} type='checkbox' value={value.name} label={value.name} defaultChecked={defaultValue} onChange={this.tagChanged} />
                    })}
                </Row>
                <Row>
                    <Col s={5}>
                        <SketchPicker color={color} colors={colors} onChangeComplete={this.handleColorChange} />
                    </Col>
                    <Col s={7}>
                        <Row>
                            <Col s={4}>
                                <Input name="tint" type='checkbox' label="Tint" onChange={this.applyTint} />
                            </Col>
                        </Row>
                        <div>
                            {this.state.filterValue.map((value, key) => {
                                return <Row id={value["name"]} key={key}>
                                    <Col s={4}>
                                        {value["displayName"]}
                                    </Col>
                                    <Col s={8}>
                                        <Slider
                                            min={value["startValue"]}
                                            max={value["endValue"]}
                                            value={value["value"]}
                                            step={value["steps"]}
                                            onChange={this.handleOnChange}
                                        />
                                    </Col>
                                </Row>
                            })}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <div style={{ height: "100px", overflow: "scroll", whiteSpace: "nowrap" }}>
                            {this.state.imageArray.map((value, key) => {
                                return <img onClick={this.onImageSelected} key={key} className="paddingAround" style={{ objectFit: "cover", display: "inline-block" }} src={value["previewURL"]} height="100px" width="100px" />
                            })}
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }
}