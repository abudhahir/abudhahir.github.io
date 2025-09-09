import { visit } from 'unist-util-visit';

export function mermaidPlugin() {
  return function (tree) {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang === 'mermaid') {
        // Replace the code block with a div that will be processed by our client-side script
        const mermaidNode = {
          type: 'html',
          value: `<div class="mermaid" data-chart="${encodeURIComponent(node.value)}">${node.value}</div>`,
        };
        
        parent.children[index] = mermaidNode;
      }
    });
  };
}
