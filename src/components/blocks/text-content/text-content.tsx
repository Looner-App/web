import './text-content.css';

export interface ITextContent extends React.HTMLAttributes<HTMLElement> {
  data: {
    content: string;
  };
}

export const TextContent = ({ data, ...props }: ITextContent) => {
  return (
    <section className="block-text-content" {...props}>
      <div className="container my-5">
        <div
          className="rich-text"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </section>
  );
};
