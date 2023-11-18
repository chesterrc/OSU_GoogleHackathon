function getTextNodes(element) {

  let textNodes = [];

  function traverse(element) {
      if (element.nodeType === 3) {
          let obtained_val = element.nodeValue.trim();
          if (obtained_val != "") {
              textNodes.push(obtained_val);
          }
          if (obtained_val.includes(" ")) {
              let f_val = obtained_val.split(/\s+/);

              for (var i = 0; i < f_val.length; i++) {
                  textNodes.push(f_val[i]);
              }
          }
      } else {
          for (let i = 0; i < element.childNodes.length; i++) {
              traverse(element.childNodes[i]);
          }
      }
  }

  traverse(element);
  return textNodes;
}

const rootElement = document.body;

const textNodesArray = getTextNodes(rootElement);