import classnames from 'classnames';
import { RewardsProgram } from '@/types/payload-types';
import dynamic from 'next/dynamic';
import ScrollBar from '@/components/Scrollbar';

import {
  Card as CardComponent,
  CardProps as CardComponentProps,
} from '@/components/card/Card';

export type LeaderboardProps = React.HTMLAttributes<HTMLElement> & {
  data: {
    rewardsProgram?: RewardsProgram;
  };
  cardVariant: CardComponentProps['cardVariant'];
};

const LeaderboardPoints = dynamic(() => import(`./points`), {
  ssr: true,
  loading: () => (
    <tr>
      <td colSpan={5} className="bg-zinc-900 p-3 text-center">
        Loading players...
      </td>
    </tr>
  ),
});

export const Leaderboard = async ({
  className,
  data,
  cardVariant,
  ...props
}: LeaderboardProps) => {
  return (
    <section
      className={classnames(
        className,
        `container lg:my-10 lg:px-14 text-white flex flex-col gap-12`,
      )}
      {...props}
    >
      <h1 className="font-cyberbang text-xl lg:text-3xl leading-normal text-center">
        Leaderboard
      </h1>
      <ScrollBar className="w-full overflow-x-auto">
        <CardComponent
          cardVariant={cardVariant}
          className="max-lg:min-w-[60rem]"
        >
          <table className="table-auto border-collapse w-full text-left rtl:text-right">
            <thead className="bg-zinc-700">
              <tr>
                <th scope="col" className="p-3 text-center">
                  Rank
                </th>
                <th scope="col" className="p-3">
                  Player
                </th>
                <th scope="col" className="p-3">
                  Challege points
                </th>
                <th scope="col" className="p-3">
                  Referral points
                </th>
                <th scope="col" className="p-3">
                  Total points
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900">
              <LeaderboardPoints rewardsProgram={data.rewardsProgram} />
            </tbody>
          </table>
        </CardComponent>
      </ScrollBar>
    </section>
  );
};

export default Leaderboard;
