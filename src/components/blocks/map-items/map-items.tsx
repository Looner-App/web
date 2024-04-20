import { Mapbox, IMapbox } from '@/components/mapbox';

export interface IMapItems extends React.HTMLAttributes<HTMLElement> {
  data: {
    title?: string;
    mapbox: IMapbox['data'];
  };
}

export const MapItems = ({ data, ...props }: IMapItems) => {
  return (
    <section className="block-map-items" {...props}>
      <div className="container my-4 lg:my-10 text-white">
        {data.title && (
          <div
            className="text-center italic font-black text-xl mb-5"
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
        )}

        <div className="md:px-10 lg:px-20">
          <div className="rounded-xl border w-full h-[calc(100vh-240px)] overflow-hidden bg-jet-black relative z-10">
            <Mapbox data={data.mapbox} className="absolute inset-0 z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
