"use client";

import "@wangeditor/editor/dist/css/style.css"; // import css
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@wangeditor/editor-for-react").then((i) => i.Editor),
  {
    ssr: false,
  }
);

const Toolbar = dynamic(
  () => import("@wangeditor/editor-for-react").then((i) => i.Toolbar),
  {
    ssr: false,
  }
);

const TextEditor = ({ value, onChange, placeholderText }) => {
  // editor instance
  const [editor, setEditor] = useState(null); // TS syntax

  const toolbarConfig = {
    toolbarKeys: [
      "undo",
      "redo",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "insertLink",
    ],
  }; // JS syntax

  const editorConfig = {
    // JS syntax
    placeholder: placeholderText || "説明文",
  };

  useEffect(() => {
    const loadEditorLanguage = async () => {
      try {
        const { i18nChangeLanguage } = await import("@wangeditor/editor");
        if (i18nChangeLanguage) {
          i18nChangeLanguage("en"); // Change to your preferred language
        } else {
          console.error("i18nChangeLanguage is undefined");
        }
      } catch (error) {
        console.error("Error loading i18nChangeLanguage:", error);
      }
    };

    loadEditorLanguage();
  }, []);

  // Timely destroy editor, important!
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={(editor) => onChange(editor.getHtml())}
          mode="default"
          style={{ height: "300px" }}
        />
      </div>
    </>
  );
};

export default TextEditor;
