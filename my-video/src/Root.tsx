import { Composition } from 'remotion';
import { CardCarousel } from './CardCarousel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CardCarousel"
        component={CardCarousel}
        durationInFrames={1080}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
