for (let i of [1, 2, 3]) {
  console.log(i);
}

function createElement(tagName, attributes, ...children) {
  let tag = document.createElement(tagName);
  if (attributes) {
    for (let attr in attributes) {
      tag.setAttribute(attr, attributes[attr]);
    }
  }
  if (children) {
    for (let child of children) {
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }
      tag.appendChild(child);
    }
  }
  return tag;
}

document.body.appendChild(<div id="a" class="c">ccc
  <div>abc</div>
  bbb
  <div></div>
  <div></div>
</div>);