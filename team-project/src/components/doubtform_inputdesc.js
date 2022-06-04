import React from "react";
import { RichUtils, EditorState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import addLinkPlugin from "./addLinkPlugin";
import getFragmentFromSelection from 'draft-js/lib/getFragmentFromSelection';

class DescInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),

    }
    this.plugins = [addLinkPlugin];
    this.renderInlineStyleButton = this.renderInlineStyleButton.bind(this)
  }
  onAddLink = () => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const selected = getFragmentFromSelection(this.state.editorState);
    const text = selected ? selected.map(x => x.getText()).join('\n') : '';
    if (selection.anchorOffset === 0 || text === '') {
      alert("Please select some text")
      return
    }
    console.log(typeof selection)
    let link = window.prompt("Insert full URL");
    if (link === null) { return }
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  };
  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };
  onStyleClick = (e) => {
    e.preventDefault();
    const val = e.currentTarget.getAttribute('data-style');
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, val)
    );
  };
  onChange = editorState => {
    this.props.assignDesc(editorState.getCurrentContent())
    this.setState({
      editorState
    });
  };
  renderInlineStyleButton(value, style) {
    const currentInlineStyle = this.state.editorState.getCurrentInlineStyle();
    let className = '';
    if (currentInlineStyle.has(style)) {
      className = 'active';
    }

    return (
      <input
        type="button"
        key={style}
        value={value}
        className={className}
        data-style={style}
        onClick={(e) => this.onStyleClick(e)}
        onMouseDown={(e) => e.preventDefault()}
      />
    );
  }

  render() {
    return (
      <div className="editorContainer ">
        {this.renderInlineStyleButton('B', 'BOLD')}
        {this.renderInlineStyleButton('U', 'UNDERLINE')}
        {this.renderInlineStyleButton('I', 'ITALIC')}
        {this.renderInlineStyleButton('C', 'CODE')}
        {this.renderInlineStyleButton('STRIKE', 'STRIKETHROUGH')}                  
        <input type="button"
          key="LINK"
          value="@"
          className="Link"
          data-style="LINK"
          id="link_url" onMouseDown={this.onAddLink} className="add-link" />
        {this.props.imageAllowed &&
          <React.Fragment>
            <label className="btn">
              <svg height="27px" viewBox="0 0 384 384" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="m336 0h-288c-26.472656 0-48 21.527344-48 48v288c0 26.472656 21.527344 48 48 48h288c26.472656 0 48-21.527344 48-48v-288c0-26.472656-21.527344-48-48-48zm-288 32h288c8.824219 0 16 7.175781 16 16v113.375l-52.6875-52.6875c-6.25-6.246094-16.375-6.246094-22.625 0l-112.6875 112.6875-40.6875-40.6875c-6.25-6.246094-16.375-6.246094-22.625 0l-68.6875 68.6875v-201.375c0-8.824219 7.175781-16 16-16zm288 320h-288c-8.824219 0-16-7.175781-16-16v-41.375l80-80 92.6875 92.679688c3.128906 3.136718 7.214844 4.695312 11.3125 4.695312s8.183594-1.558594 11.3125-4.6875c6.246094-6.25 6.246094-16.375 0-22.625l-40.6875-40.6875 101.375-101.367188 64 64v129.367188c0 8.824219-7.175781 16-16 16zm0 0" /><path d="m128 96c0 17.671875-14.328125 32-32 32s-32-14.328125-32-32 14.328125-32 32-32 32 14.328125 32 32zm0 0" /></svg>
              <input id="Image" type='file' accept='image/*' onChange={this.props.imagehandler} hidden /></label>
            {this.props.image === "" ? null :
              <span style={{ color: "rgb(31,48,74)" }}>
                <br />
                <i>{this.props.image}</i>
                <svg cursor="pointer" onClick={this.props.removeimage} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="15px" height="15px"><path fill="rgb(31,48,74)" d="M8 9.704L4.057 13.646 2.354 11.943 6.296 8 2.354 4.057 4.057 2.354 8 6.296 11.943 2.354 13.646 4.057 9.704 8 13.646 11.943 11.943 13.646z" /><path fill="rgb(31,48,74)" d="M11.943,2.707l1.35,1.35L9.704,7.646L9.35,8l0.354,0.354l3.589,3.589l-1.35,1.35L8.354,9.704L8,9.35 L7.646,9.704l-3.589,3.589l-1.35-1.35l3.589-3.589L6.65,8L6.296,7.646L2.707,4.057l1.35-1.35l3.589,3.589L8,6.65l0.354-0.354 L11.943,2.707 M11.943,2L8,5.943L4.057,2L2,4.057L5.943,8L2,11.943L4.057,14L8,10.057L11.943,14L14,11.943L10.057,8L14,4.057 L11.943,2L11.943,2z" /></svg>
              </span>}
          </React.Fragment>}
        <Editor placeholder={this.props.placeholder} editorState={this.state.editorState} handleKeyCommand={this.handleKeyCommand} onChange={this.onChange} plugins={this.plugins} spellCheck={true} />
      </div >
    );
  }
}

export default DescInput