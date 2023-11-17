export class Camera {
  public video!: HTMLVideoElement;

  constructor() {
    this.video = document.querySelector('#video')!;
  }

  static async setUpCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const videoConfig: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: 'user',
        width: window.innerWidth,
        height: window.innerHeight,
        frameRate: {
          ideal: 60,
        },
      }
    };

    const camera = new Camera();
    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
    camera.video.srcObject = stream;
  
    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve('');
      };
    });

    camera.video.play();

    const videoWidth = camera.video.videoWidth;
    const videoHeight = camera.video.videoHeight;
    // Must set below two lines, otherwise video element doesn't show.
    camera.video.width = videoWidth;
    camera.video.height = videoHeight;

    // Because the image from camera is mirrored, need to flip horizontally.
    // camera.ctx.translate(camera.video.videoWidth, 0);
    // camera.ctx.scale(-1, 1);

    return camera;
  }

  animate() {
    
  }
}