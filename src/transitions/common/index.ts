import {
  finishControlPanel,
  finishHud,
  initControlPanel,
  initHud,
} from "../components";

export const commonInitializer =
  (fn: (...args: any[]) => Promise<any>, title?: ArtworkTitle) =>
  async (...args: any[]) => {
    await Promise.all([await initControlPanel(title), await initHud()]);
    await fn(args);
  };

export const commonFinisher =
  (fn: (...args: any[]) => Promise<any>, title?: ArtworkTitle) =>
  async (...args: any[]) => {
    await Promise.all([finishControlPanel(), finishHud()]);
    await fn(args);
  };
