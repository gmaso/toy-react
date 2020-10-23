import { createElement, Component, render } from './toy-react'

class MyComponent extends Component {
  constructor(){
    super();
    this.state = {
      a: 1,
      b: 2
    }
  }
  render(){
    return <div>
      <h1>my component</h1>
      <span>{this.state.a.toString()}</span>
      {this.children}
      </div>
  }
}


render(<MyComponent id="a" class="c">ccc
  <div>abc</div>
  bbb
  <div></div>
  <div></div>
</MyComponent>, document.body);