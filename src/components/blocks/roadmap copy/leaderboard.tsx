'use client';

import classnames from 'classnames';

export type LeaderboardProps = React.HTMLAttributes<HTMLElement> & {
  data: {
    id?: string | null;
  };
};

export const Leaderboard = ({
  className,
  data,
  ...props
}: LeaderboardProps) => {
  return (
    <section
      className={classnames(className, `container my-10 px-14 text-white`)}
      {...props}
    >
      leaderboard... {data.id}
    </section>
  );
};

export default Leaderboard;
