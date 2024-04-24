'use client';

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  title: string;
  description: string;
};

export const Card = ({ title, description, ...props }: CardProps) => {
  return (
    <div {...props}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};
