import React from 'react'
import { Redirect } from 'react-router-dom'
import TagsComp from "./Tagscomp"
import axios from 'axios'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import Editor from "draft-js-plugins-editor";
import { ProductConsumer } from "./context"
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";
import { CompositeDecorator } from "draft-js";
import addLinkPlugin from "./addLinkPlugin";
import PostReply from "./PostReply"
import ReplyCard from "./ReplyCard"
import { Link } from 'react-router-dom'
import { Jump } from 'react-jump';
import Moment from 'react-moment';

class FullDoubtWithAnswers extends React.Component {

  constructor() {
    super();
    this.plugins = [addLinkPlugin];
    this.state = {
      init: true,
      doubt: null,
      newanswer: null,
      ReplyCardsComponent: null,
      related_doubts: []
    }
  }

  getPluginDecoratorArray = () => {
    let decorators = [];
    let plugin;
    for (plugin of this.plugins) {
      if (plugin.decorators !== null && plugin.decorators !== undefined) {
        decorators = decorators.concat(plugin.decorators);
      }
    }
    return decorators;
  }
  myFunctionForGrabbingAllPluginDecorators = () => {
    return new MultiDecorator(
      [new CompositeDecorator(this.getPluginDecoratorArray())]
    );
  }
  changreplyarr = () => {

  }

  comparator(a, b) {
    if (a.matching_tags.length > b.matching_tags.length) { return -1; }
    else if (a.matching_tags.length < b.matching_tags.length) { return 1; }
    else {
      if (a.views > b.views) { return -1; }
      else return 1;
    }
  }

  componentDidMount() {
    this.setState({ init: true })
    axios.get(`https://resolve4.herokuapp.com/doubt/${this.doubtid}`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
      .then((res) => {
        this.setState({ doubt: res.data.doubt })
        axios.post(`https://resolve4.herokuapp.com/reply/getrepliesofdoubt`, { ids: res.data.doubt.replies }, { withCredentials: true, headers: { "Content-Type": "application/json" } })
          .then((res1) => {
            let replyarr = res1.data.reply
            replyarr.sort((a, b) => {
              return b.upvotes - a.upvotes
            })
            let tempdoc = replyarr.map((reply) => {
              return (<ReplyCard key={reply._id} reply={reply} user={this.props.user} doubt={this.state.doubt} />)
            })
            this.setState({ ReplyCardsComponent: tempdoc, init: false })
            axios.post('https://resolve4.herokuapp.com/doubt/getrelated', { tags: res.data.doubt.tags }, { withCredentials: true, headers: { "Content-Type": "application/json" } })
              .then((res2) => {
                let sorted_related_doubts = res2.data.doubts.sort(this.comparator)
                let final_related_doubts = sorted_related_doubts.filter((item) => {
                  if (item._id == res.data.doubt._id) { return false; }
                  else { return true }
                })
                let limit = final_related_doubts.length;
                let related_doubts_comp = [];
                for (let i = 1; i <= limit; i++) {
                  let matching_tags_comp = []
                  for (let match_tag of final_related_doubts[i - 1].matching_tags) {
                    matching_tags_comp.push(
                      <span id='matching_tags'>{match_tag}</span>
                    )
                  }
                  related_doubts_comp.push(
                    <li>
                      <a href={`https://resolve4.herokuapp.com/doubts/${final_related_doubts[i - 1]._id}`}>
                        {final_related_doubts[i - 1].title.length < 40 ? final_related_doubts[i - 1].title : final_related_doubts[i - 1].title.substring(0, 40) + "..."}
                        <br />
                        <span style={{ fontSize: '8pt' }}><u>Matching tags</u>:{matching_tags_comp}</span>
                      </a>
                    </li>
                  )
                }
                this.setState({ related_doubts: related_doubts_comp })
              })
          })
          .catch((err) => {
            console.log(err)
            this.setState({ init: false })
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  bookmarkhandler = (object) => {
    let bookmarkdata = {
      userid: object.user._id,
      doubtid: this.doubtid,
      bookmarks: object.user.bookmarks
    }
    axios.post("https://resolve4.herokuapp.com/doubt/addbookmark", bookmarkdata, { withCredentials: true, headers: { "Content-Type": "application/json" } })
      .then((res) => {
        if (res.data.status === true) {
          console.log("Success")
          object.appendbookmark(res.data.bookmarks)
        }
        else { console.log(res.data.err) }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  bookmarkremover = (object) => {
    let bookmarkdata = {
      userid: object.user._id,
      doubtid: this.doubtid,
      bookmarks: object.user.bookmarks
    }
    axios.post("https://resolve4.herokuapp.com/doubt/removebookmark", bookmarkdata, { withCredentials: true, headers: { "Content-Type": "application/json" } })
      .then((res) => {
        if (res.data.status === true) {
          console.log("Success")
          object.appendbookmark(res.data.bookmarks)
        }
        else { console.log(res.data.err) }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    this.doubtid = this.props.id;
    if (this.state.init === true) {
      return (
        <div className="spinner-grow text-info" role="status" style={{ marginLeft: "48%", marginTop: "18%", transform: "scale(3)" }}>
          <span className="sr-only text-center mx-auto my-auto">Loading...</span>
        </div>
      )
    }
    if (this.state.init === false && this.state.doubt === null) {
      return (
        <Redirect to='/problem_page_for_all_so_that_no_one_can_guess_this_path_@ksbdb' exact="true" strict="true" />
      )
    }

    let tagsarr = this.state.doubt.tags.split(",")
    let tags = tagsarr.map((tag, index) => {
      return <TagsComp tag={tag} index={index} key={this.state._id + index} />
    })
    let des = JSON.parse(this.state.doubt.description)
    const contentState = convertFromRaw(des);
    let decorator = this.myFunctionForGrabbingAllPluginDecorators();
    const editorState = EditorState.createWithContent(contentState, decorator);

    if (this.state.init === false && this.state.doubt !== null) {
      return (
        <ProductConsumer>
          {(object) => {
            let username = this.state.doubt.username

            return (
              <React.Fragment>
                <div className="FullDoubtwithAnswers">
                  <div className='container'>
                    <br />

                    <div className="row">
                      <div className="col-lg-8 pr-lg-5">

                        <p id="doubt-title">{this.state.doubt.title}</p>

                        <div className="d-flex">
                          {this.state.doubt.dp === "" ? <div className="dp text-center">{username[0]}</div> :
                            <div className="dp text-center mb-4" style={{ backgroundColor: "#031227", border: "1px solid #031227" }}><img style={{ height: "2em", width: "2em" }} src={"https://resolve4.herokuapp.com" + this.state.doubt.dp} /></div>}
                          <div className="by-line align-self-center ml-3">
                            <div><Link to={`/public_user_profile/${this.state.doubt.user}`} exact="true" strict="true">{username}</Link></div>
                            <div> <Moment fromNow>{this.state.doubt.date}</Moment></div>
                          </div>
                        </div>

                        <div className="ViewDescription content-box p-3 my-3">
                          <Editor readOnly={true} editorState={editorState} />
                          {this.state.doubt.code !== "" &&
                            <div className="code p-2 pl-3 mt-3 mr-md-5">{this.state.doubt.code}</div>}
                          {this.state.doubt.image === "" ? null :
                            <div className='row'>
                              <a href={'https://resolve4.herokuapp.com' + this.state.doubt.image} target="_blank" ><img style={{ width: "25%", height: "90%" }} src={"https://resolve4.herokuapp.com" + this.state.doubt.image} /></a>
                            </div>}
                          <div id="tags-hr" className="tags-icons mt-3 pt-3 d-flex flex-column flex-sm-row justify-content-between">
                            <div>
                              {tags}
                            </div>

                            <div className="ml-auto mt-2 mt-sm-0">
                              {object.user !== null ?
                                object.user.bookmarks.indexOf(this.doubtid) === -1 ? <button style={{ backgroundColor: "#031227", border: "1px solid #031227", outline: "none" }} onClick={() => this.bookmarkhandler(object)}>
                                  <span title="Add Bookmark">
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bookmark"
                                      className="my-icon svg-inline--fa fa-bookmark fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 384 512">
                                      <path color="#05386B" fill="currentColor"
                                        d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path>
                                    </svg>
                                  </span></button> : <button style={{ backgroundColor: "#031227", border: "1px solid #031227", outline: "none" }} onClick={() => this.bookmarkremover(object)}>
                                    <span title="Remove Bookmark">
                                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bookmark"
                                        className="my-icon svg-inline--fa fa-bookmark fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512">
                                        <path color="#5CDB95" fill="currentColor"
                                          d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path>
                                      </svg>
                                    </span></button> : null}

                            </div>
                          </div>
                        </div>
                        <div id="margin-b" className="tags-icons mt-3 pb-3 d-flex justify-content-between">
                          <div>
                            <Jump target={'#PostReply'}><a href="#" className="btn btn-md btn-success">Post an Answer</a></Jump>
                          </div>

                          <div className="ml-auto mt-2 mt-sm-0 pt-md-1">
                            <span>
                              <p className="d-inline">{this.state.ReplyCardsComponent.length} </p>
                              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="comment"
                                className="my-icon svg-inline--fa fa-comment fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <path fill="currentColor"
                                  d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z">
                                </path>
                              </svg>
                            </span>
                            <span>
                              <p className="d-inline">{this.state.doubt.views} </p>
                              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye"
                                className="my-icon svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512">
                                <path fill="currentColor"
                                  d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z">
                                </path>
                              </svg>
                            </span>
                          </div>
                        </div>
                        <div id="reply-section" className="pt-4">
                          <h3>Replies</h3>
                          {this.state.ReplyCardsComponent}
                        </div>
                        <br />
                        <h2>Your Answer</h2>
                        <div id="PostReply">
                          <PostReply doubtid={this.doubtid} doubt={this.state.doubt} repliesarr={this.state.doubt.replies} />
                        </div>
                      </div>
                      <div className="col-lg-4 mt-4 mt-lg-3">
                        <div id='related-section'>
                          <div id="related-section-inner">
                            <h3>Related Doubts</h3>
                            <hr id='related_doubts_hr' />
                            <ul>
                              {this.state.related_doubts}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
              </React.Fragment>
            )
          }}
        </ProductConsumer>
      )
    }
  }
}
export default FullDoubtWithAnswers