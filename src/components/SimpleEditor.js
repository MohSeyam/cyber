import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    [{ 'direction': 'rtl' }],
    ['clean']
  ]
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link', 'direction'
];

function SimpleEditor({ content, onUpdate }) {
  return (
    <div dir="rtl">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onUpdate}
        modules={modules}
        formats={formats}
        style={{ minHeight: 150, background: 'white' }}
      />
    </div>
  );
}

export default SimpleEditor;