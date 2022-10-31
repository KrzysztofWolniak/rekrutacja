/* eslint-disable prettier/prettier */
export default class WindowSettings {
  static getWindowsSettings(storage: any) {
    const defaultBounds = [1024, 728];
    const size = storage.get('win-size');
    if (size) return size;

    storage.set('win-size', defaultBounds);
    return defaultBounds;
  }

  static saveBounds(storage: any, bounds: any) {
    storage.set('win-size', bounds);
  }

  static getWindowPosition(storage: any) {
    const defaultPositionBounds = [0, 0];
    const position = storage.get('win-position');
    if (position) return position;

    storage.set('win-positon', defaultPositionBounds);
    return defaultPositionBounds;
  }

  static savePosition(storage: any, bounds: any) {
    storage.set('win-position', bounds);
  }
}
