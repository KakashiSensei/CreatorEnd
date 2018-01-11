import * as fonts from "../font.json";
import * as _ from "lodash";
import { FontStructure } from "./react/page/postImage/postImageConstants";

namespace LoadFont {
    export let fontLoaded: Array<FontStructure> = [];

    export function load(font?: FontStructure) {
        let fontArray: Array<FontStructure> = [];
        if (font) {
            let fontObject = _.find(this.fontLoaded, (obj: FontStructure) => {
                return obj.name === font.name;
            })
            !fontObject && fontArray.push(font);
        } else {
            let fontJSON = fonts["font"];
            for (let i = 0; i < fontJSON.length; i++) {
                let fontName = fontJSON[i].name;
                let fontObject = _.find(this.fontLoaded, (obj: FontStructure) => {
                    return obj.name === fontName;
                })
                !fontObject && fontArray.push(fontJSON[i]);
            }
        }
        _.forEach(fontArray, (value, key) => {
            var newElement = document.createElement("style");
            newElement.type = "text/css"; 
            newElement.innerHTML = `@font-face {font-family: ${value.name};  src: url(${value.ttf});}`;   
            document.getElementsByTagName('head')[0].appendChild(newElement);
        })
    }
}

export default LoadFont;