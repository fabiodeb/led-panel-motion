import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const SCENE_DURATION_FRAMES = 120;
const TRANSITION_FRAMES = 30;

const KenBurnsScene: React.FC<{
  src: string;
  zoomFrom: number;
  zoomTo: number;
  panXFrom: number;
  panXTo: number;
  panYFrom: number;
  panYTo: number;
}> = ({ src, zoomFrom, zoomTo, panXFrom, panXTo, panYFrom, panYTo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const scale = interpolate(progress, [0, 1], [zoomFrom, zoomTo]);
  const translateX = interpolate(progress, [0, 1], [panXFrom, panXTo]);
  const translateY = interpolate(progress, [0, 1], [panYFrom, panYTo]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f0ede8" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES}>
          <KenBurnsScene
            src={staticFile("cena1.png")}
            zoomFrom={1.05}
            zoomTo={1.12}
            panXFrom={0}
            panXTo={-15}
            panYFrom={0}
            panYTo={-8}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES}>
          <KenBurnsScene
            src={staticFile("cena2.png")}
            zoomFrom={1.08}
            zoomTo={1.03}
            panXFrom={10}
            panXTo={-10}
            panYFrom={5}
            panYTo={-5}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES}>
          <KenBurnsScene
            src={staticFile("cena3.png")}
            zoomFrom={1.04}
            zoomTo={1.1}
            panXFrom={-12}
            panXTo={8}
            panYFrom={-6}
            panYTo={4}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION_FRAMES}>
          <KenBurnsScene
            src={staticFile("cena4.png")}
            zoomFrom={1.1}
            zoomTo={1.04}
            panXFrom={8}
            panXTo={-8}
            panYFrom={4}
            panYTo={-4}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
