const RENDER_TO_DOM = Symbol('render to dom');

class ElementWrapper {
  constructor(type){
    this.root = document.createElement(type);
  }
  setAttribute(name, value){
    if (/^on/i.test(name)) {
      this.root.addEventListener(name.replace('on', '').toLowerCase(), value);
    } else {
      this.root.setAttribute(name, value);
    }
  }
  appendChild(component){
    let range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    component[RENDER_TO_DOM](range);
  }
  [RENDER_TO_DOM](range){
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(content){
    this.root = document.createTextNode(content);
  }
  [RENDER_TO_DOM](range){
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export class Component {
  constructor(){
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
    this._range = null;
    this._state = null;
  }
  setAttribute(name, value){
    this.props[name] = value;
  }
  appendChild(component){
    this.children.push(component);
  }
  [RENDER_TO_DOM](range){
    this._range = range;
    this.render()[RENDER_TO_DOM](range);
  }
  rerender(){
    this._range.deleteContents();
    this.render()[RENDER_TO_DOM](this._range);
  }
  setState(newState){
    if (this._state === null || typeof this._state !== 'object') {
      this._state = newState;
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
    merge(this._state, newState);
    this.rerender();
  }
}

export function createElement(type, attributes, ...children) {
  let tag;
  if (typeof type === 'function') {
    tag = new type();
  } else {
    tag = new ElementWrapper(type);
  }
  if (attributes) {
    for (let attr in attributes) {
      tag.setAttribute(attr, attributes[attr]);
    }
  }
  if (children) {
    let insertChildren = (children) => {
      for (let child of children) {
        if (typeof child === 'string') {
          child = new TextWrapper(child);
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