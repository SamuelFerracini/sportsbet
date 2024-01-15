export function removeHTMLComments(input) {
  return input.replace(/<!--[\s\S]*?-->/g, "");
}
