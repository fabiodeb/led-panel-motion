import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

const SCENE_DURATION_FRAMES = 120;
const TRANSITION_FRAMES = 30;
const SCENE_COUNT = 4;
const TOTAL_FRAMES =
  SCENE_COUNT * SCENE_DURATION_FRAMES -
  (SCENE_COUNT - 1) * TRANSITION_FRAMES;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LedPanelMotion"
        component={MyComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
