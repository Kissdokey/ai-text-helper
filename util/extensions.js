import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Code from "@tiptap/extension-code";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import suggestion from './suggestion.js'
const isa = true;
const extensions = [
    StarterKit,
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: "height-line-style",
      },
    }),
    TextStyle,
    Code.configure({
      HTMLAttributes: {
        class: isa ? "code-style" : "",
      },
    }),
    Underline.configure({
      HTMLAttributes: {
        class: "under-line-style",
      },
    }),
    Link.configure({
      openOnClick: false,
    }),
    Color.configure({
      types: ["textStyle"],
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading") {
          return "What’s the title?";
        }
        return "Can you add some further context?";
      },
    }),
    CodeBlock.configure({
      HTMLAttributes: {
        class: "code-block-style",
        exitOnTripleEnter: false,
        exitOnArrowDown: false,
      },
    }),
    Blockquote,
    BulletList.configure({
      HTMLAttributes: {
        class: "bullet-list-style",
        keepMarks: true,
        keepAttributes: true,
      },
    }),
    ListItem,
    Heading.configure({
      levels: [1, 2,3,4,5,6],
    }),
    Image.configure({
      allowBase64: true,
      class: "image-style",
    }),
    Mention.configure({
      HTMLAttributes: {
        class: "mention",

      },
      suggestion
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ]
  export default extensions