import { Storyboard } from "dotosb"

declare module "dotosu" {
  function loadBeatmap(path: String): Beatmap;

  type Color = {
    r: number,
    g: number,
    b: number,
  }
  
  type Position = {
    x: number,
    y: number,
  }
  
  type HitObject = {
    position: Position
    time: number,
    type: number,
    color: Color
  }
  
  type RedTimingPoint = {
    type: string,
    time: number,
    sampleSet: number,
    sampleIndex: number,
    volume: number,
    meter: number,
    beatLength: number,
    bpm: number,
    kiai: boolean,
  }
  
  type GreenTimingPoint = {
    type: string,
    time: number,
    sampleSet: number,
    sampleIndex: number,
    volume: number,
    bdsv: number,
    multiplier: number,
    kiai: boolean
  }
  
  type GeneralInformation = {
    audiofilename: string,
    audioleadin: number,
    previewtime: number,
    countdown: number,
    sampleset: string,
    stackleniency: number,
    mode: number,
    letterboxinbreaks: number,
    widescreenstoryboard: number,
  }
  
  type EditorInformation = {
    bookmarks: number[],
    distancespacing: number,
    beatdivisor: number,
    gridsize: number,
    timelinezoom: number,
  }
  
  type Metadata = {
    title: string,
    titleunicode: string,
    artist: string,
    artistunicode: string,
    creator: string,
    version: string,
    source: string,
    tags: string[],
    beatmapid: number,
    beatmapsetid: number,
  }
  
  type Difficulty = {
    hpdrainrate: number,
    circlesize: number,
    overalldifficulty: number,
    approachrate: number,
    slidermultiplier: number,
    slidertickrate: number,
  }
  
  type Beatmap = {
    colours: Color[],
    format_number: string,
    general: GeneralInformation,
    editor: EditorInformation,
    metadata: Metadata,
    difficulty: Difficulty,
    storyboard: Storyboard,
    timingpoints: [
      red: RedTimingPoint[],
      green: GreenTimingPoint[],
    ]
    hitobjects: HitObject[],
  }
}

