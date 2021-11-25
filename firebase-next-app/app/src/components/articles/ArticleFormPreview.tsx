import "github-markdown-css/github-markdown-light.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

// TODO watchの型をつけれるようだったらつける
interface ArticleFormPreviewProps {
  watchData: any;
}

// TODO　暇あったら簡単だからdarkmode作りたい
const ArticleFormPreview: React.FC<ArticleFormPreviewProps> = ({
  watchData,
}) => {
  return (
    <div className="h-full w-full mr-10">
      <div className="markdown-preview h-full w-full border shadow-xl mb-5 rounded-xl py-4 px-2 overflow-y-scroll bg-white">
        <ReactMarkdown
          className="markdown-body p-3 bg-white text-gray-700"
          remarkPlugins={[gfm]}
          // eslint-disable-next-line react/no-children-prop
          children={watchData}
        />
      </div>
    </div>
  );
};

export default ArticleFormPreview;
