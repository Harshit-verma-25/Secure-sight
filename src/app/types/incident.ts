export interface Incident {
  id: string;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera: Camera;
  cameraId: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  incidents: Incident[];
}
