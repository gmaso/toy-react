const RENDER_TO_DOM = Symbol('render to dom');

export class Component {
  constructor(){
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
    this._range = null;
  }
  setAttribute(name, value){
    this.props[name] = value;
  }
  appendChild(component){
    this.children.push(component);
  }
  get vdom() {
    return this.render().vdom
  }
  get vchildren () {
    return this.children.map(child => child.vdom)
  }
  [RENDER_TO_DOM](range){
    this._range = range;
    this.render()[RENDER_TO_DOM](range);
  }
  rerender(){
    let oldRange = this._range;

    let range = document.createRange();
    range.setStart(oldRange.startContainer, oldRange.startOffset);
    range.setEnd(oldRange.startContainer, oldRange.startOffset);
    this[RENDER_TO_DOM](range);

    oldRange.setStart(range.endContainer, range.endOffset);
    oldRange.deleteContents();
  }
  setState(newState){
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState;
      this.rerender();
      return;
    }
    let merge = (oldState, newState) => {
      for(let k in newState) {
        if (oldState[k] === null || typeof oldState[k] !== 'object') {
          oldState[k] = newState[k];
        } else {
          merge(oldState[k], newState[k]);
        }
      }
    }
    merge(this.state, newState);
    this.rerender();
  }
}


class ElementWrapper extends Component {
  constructor(type){
    super(type);
    this.type = type;
  }
  // setAttribute(name, value){
  //   if (/^on/i.test(name)) {
  //     this.root.addEventListener(name.replace('on', '').toLowerCase(), value);
  //   } else if (name === 'className') {
  //     this.root.setAttribute('class', value);
  //   } else {
  //     this.root.setAttribute(name, value);
  //   }
  // }
  get vdom() {
    return this;
    return {
      type: this.type,
      props: this.props,
      children: this.children.map(child => child.vdom)
    }
  }
  // appendChild(component){
  //   let range = document.createRange();
  //   range.setStart(this.root, this.root.childNodes.length);
  //   range.setEnd(this.root, this.root.childNodes.length);
  //   component[RENDER_TO_DOM](range);
  // }
  [RENDER_TO_DOM](range){
    range.deleteContents();

    let root = document.createElement(this.type);
    for (let name in this.props) {
      let value = this.props[name];
      if (/^on/i.test(name)) {
        root.addEventListener(name.replace('on', '').toLowerCase(), value);
      } else if (name === 'className') {
        root.setAttribute('class', value);
      } else {
        root.setAttribute(name, value);
      }
    }

    for (let child of this.children) {
      let childRange = document.createRange();
      childRange.setStart(root, root.childNodes.length);
      childRange.setEnd(root, root.childNodes.length);
      child[RENDER_TO_DOM](childRange);
    }

    range.insertNode(root);
  }
}

class TextWrapper extends Component {
  constructor(content){
    super(content);
    this.type = '#text';
    this.content = content;
    this.root = document.createTextNode(content);
  }
  get vdom(){
    return this;
    return {
      type: '#text',
      content: this.content
    }
  }
  [RENDER_TO_DOM](range){
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export function createElement(type, attributes, ...children) {
  let tag;
  if (typeof type === 'string') {
    tag = new ElementWrapper(type);
  } else {
    tag = new type;
  }
  if (attributes) {
    for (let attr in attributes) {
      tag.setAttribute(attr, attributes[attr]);
    }
  }
  if (children) {
    let insertChildren = (children) => {
      for (let child of children) {
        console.log(child)
        if (typeof child === 'string') {
          child = new TextWrapper(child);
        }
        if (child === null) {
          continue;
        }
        if (typeof child === 'object' && child instanceof Array) {
          insertChildren(child);
        } else {
          tag.appendChild(child);
        }
      }
    }
    insertChildren(children);
  }
  return tag;
}

export function render(component, parentElement) {
  let range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}