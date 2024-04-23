'use client';

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  title: string;
  description: string;
};

export const Card = ({ title, description, ...props }: CardProps) => {
  return (
    <div {...props}>
      <h2 className="uppercase text-2xl font-bold ">{title}</h2>
      <p>{description}</p>
    </div>
  );
};
