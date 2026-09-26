import React, { useMemo } from 'react';
import { marked } from 'marked';

// Configure marked renderer
marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function MarkdownPreview({ content, title }) {
  const renderedHtml = useMemo(() => {
    if (!content && !title) {
      return '<p class="text-muted"><em>Nothing to preview yet...</em></p>';
    }

    const fullMarkdown = title ? `# ${title}\n\n${content || ''}` : (content || '');
    try {
      return marked.parse(fullMarkdown);
    } catch (err) {
      console.error('Markdown parse error:', err);
      return '<p>Error parsing markdown</p>';
    }
  }, [content, title]);

  return (
    <div className="preview-pane">
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  );
}
