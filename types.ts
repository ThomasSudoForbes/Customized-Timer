
export enum SegmentType {
  PREPARE = 'prepare',
  WORK = 'work',
}

export interface Segment {
  id: number;
  type: SegmentType;
  label: string;
  duration: number; // in seconds
}
