function getTextNodes(element) {

  let textNodes = [];

  function traverse(element) {
      if (element.nodeType === 3) {
          let obtained_val = element.nodeValue.trim();
          const regex = /[.,'(){}[\]<>?!@#\$%""^/&*;:]/g;
          let f_obtained = obtained_val.replace(regex, '');

          if (f_obtained.includes(" ")) {
            if (f_obtained != " " || f_obtained != "") {
              let f_val = f_obtained.split(" ");
              for (var i = 0; i < f_val.length; i++) {
                  textNodes.push(f_val[i]);
              }
            }
          }

          else if (f_obtained != "") {
              textNodes.push(f_obtained);
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
