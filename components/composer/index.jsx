
import React, { Component } from "react";
import { convertFromRaw, EditorState } from "draft-js";

import Editor, { composeDecorators } from "@draft-js-plugins/editor";

import createImagePlugin from "@draft-js-plugins/image";

import createAlignmentPlugin from "@draft-js-plugins/alignment";

import createFocusPlugin from "@draft-js-plugins/focus";

import createResizeablePlugin from "@draft-js-plugins/resizeable";

import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";

import createDragNDropUploadPlugin,{ readFile }  from "@draft-js-plugins/drag-n-drop-upload";


const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();

const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

/* eslint-disable */
const initialState = {
  entityMap: {
    0: {
      type: "Image",
      //mutability: "IMMUTABLE",
      data: {
        src: "https://ibb.co/HP1f0hC"
      }
    }
  },
  blocks: []
};
/* eslint-enable */

export default class Composer extends Component {
  state = {
    editorState: EditorState.createWithContent(convertFromRaw(initialState)),
    fileList:[]
  };
   imagePlugin = createImagePlugin({ decorator });

   mock = (data, success, failed, progress) => {
    console.log("sucess", success);
    Promise.all(data.files.map(readFile))
      .then((files) => {
       let tempFiles=[...this.state.fileList];
       files.forEach(element => {
           tempFiles.push(element)
       });
     this.setState({fileList:tempFiles})
       return success(files, { retainSrc: true });
      })
  };
   dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload:this. mock,
    addImage: this.imagePlugin.addImage
  });
  
   plugins = [
    this.dragNDropFileUploadPlugin,
    blockDndPlugin,
    focusPlugin,
    resizeablePlugin,
    this.imagePlugin
  ];
  

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <div 
         onClick={this.focus}>

<div  style={{backgroundColor:'gray',width:'100%',height:150}}
     >  
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={this.plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          </div>
          <br/>
          <button
            type="button"
            value="Click"
            placeholder="click me"
            onClick={()=>{
this.state.fileList.forEach(element => {
    console.log('files name', element.name)
});
            }}
            style={{
              color: "#000",
              backgroundColor: "#fafafa",
                 width: 750,
              height: 30,borderWidth:1,
              borderColore:'#a2a8a3'
            }}
          >Submit</button>
        </div>
      </div>
    );
  }
}
