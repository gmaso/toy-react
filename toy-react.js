class ElementWrapper {
  constructor(type){
    this.root = document.createElement(type);
  }
  setAttribute(name, value){
    this.root.setAttribute(name, value);
  }
  appendChild(component){
    this.root.appendChild(component.root)
  }

}

class TextWrapper {
  constructor(content){
    this.root = document.createTextNode(content);
  }
}

export class Component {
  constructor(){
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
  }
  setAttribute(name, value){
    this.props[name] = value;
  }
  appendChild(component){
    this.children.push(component);
  }
  get root() {
    if (!this._root) {
      this._root = this.render().root;
    }
    return this._root;
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
  parentElement.appendChild(component.root);
}