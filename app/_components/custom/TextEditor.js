import Editor from "react-simple-wysiwyg";

const TextEditor = ({ value, onChange }) => {
  return (
    <>
      <Editor value={value} onChange={(e) => onChange(e.target.value)} />
    </>
  );
};

export default TextEditor;
