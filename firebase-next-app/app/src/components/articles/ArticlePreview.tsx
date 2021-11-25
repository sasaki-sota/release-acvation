import { NextPage } from "next";
import "github-markdown-css/github-markdown-light.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

interface ArticlePreviewProps {
  content: string;
}

const ArticlePreview: NextPage<ArticlePreviewProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="markdown-body p-3 text-white"
      remarkPlugins={[gfm]}
      // eslint-disable-next-line react/no-children-prop
      children={content}
    />
  );
};

export default ArticlePreview;
