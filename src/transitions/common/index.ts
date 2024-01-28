import { finishPanel, finishHud, initPanel, initHud } from "../components";

export const commonInitializer =
  (fn: (...args: any[]) => Promise<any>, title?: ArtworkTitle) =>
  async (...args: any[]) => {
    await Promise.all([await initPanel(title), await initHud()]);
    await fn(args);
  };

export const commonFinisher =
  (fn: (...args: any[]) => Promise<any>, title?: ArtworkTitle) =>
  async (...args: any[]) => {
    await Promise.all([finishPanel(), finishHud()]);
    await fn(args);
  };
