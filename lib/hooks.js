// function hooks

// processContent hook: replace markdown { aside|section|article } with HTML tags
export function contentSections( data ) {
  data.content = data.content
    .replace(/\{\s*(\/{0,1}(?:aside|section|article))([^}]*)\s*\}/gi, '<$1$2>')
    .replace(/<p><(\/{0,1}(?:aside|section|article))([^>]*)><\/p>/gi, '<$1$2>');
}

// processPostRender hook: add further HTML meta data
export function postrenderMeta( output, data ) {
  if (data.isHTML && data.template !== 'redirect.html') {
    output = output.replace('</head>', '<meta name="generator" content="Publican.dev">\n</head>');
  }
  return output;
}
