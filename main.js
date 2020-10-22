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
        tag.innerText = child;
      } else {
        tag.appendChild(child);
      }
    }
  }
  return tag;
}

window.a = <div id="a" class="c">ccc
  <div>abc</div>
  <div></div>
  <div></div>
</div>