import React from 'react';
import {
  Bold,
  Italic,
  Heading,
  Code,
  Quote,
  List,
  ListOrdered,
  Link,
  CheckSquare
} from 'lucide-react';

export default function MarkdownToolbar({ onInsert }) {
  const tools = [
    { label: 'Bold', icon: <Bold size={16} />, prefix: '**', suffix: '**', placeholder: 'bold text' },
    { label: 'Italic', icon: <Italic size={16} />, prefix: '*', suffix: '*', placeholder: 'italic text' },
    { label: 'Heading', icon: <Heading size={16} />, prefix: '## ', suffix: '', placeholder: 'Heading' },
    { type: 'divider' },
    { label: 'Inline Code', icon: <Code size={16} />, prefix: '`', suffix: '`', placeholder: 'code' },
    { label: 'Quote', icon: <Quote size={16} />, prefix: '> ', suffix: '', placeholder: 'Quote' },
    { label: 'Bullet List', icon: <List size={16} />, prefix: '- ', suffix: '', placeholder: 'List item' },
    { label: 'Numbered List', icon: <ListOrdered size={16} />, prefix: '1. ', suffix: '', placeholder: 'List item' },
    { label: 'Task List', icon: <CheckSquare size={16} />, prefix: '- [ ] ', suffix: '', placeholder: 'Task item' },
    { label: 'Link', icon: <Link size={16} />, prefix: '[', suffix: '](https://example.com)', placeholder: 'link text' },
  ];

  return (
    <div className="formatting-toolbar">
      {tools.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={`divider-${index}`} className="toolbar-divider" />;
        }
        return (
          <button
            key={item.label}
            type="button"
            className="toolbar-btn"
            title={item.label}
            onClick={() => onInsert(item.prefix, item.suffix, item.placeholder)}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
}
