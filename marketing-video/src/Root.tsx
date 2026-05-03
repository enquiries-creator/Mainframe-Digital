import { Composition } from "remotion";
import { IndustryDJAd } from "./IndustryDJAd";

export const FPS = 30;
export const DURATION_IN_FRAMES = 300; // 10 seconds @ 30fps

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="IndustryDJAd"
        component={IndustryDJAd}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="IndustryDJAdSquare"
        component={IndustryDJAd}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1080}
      />
    </>
  );
};
