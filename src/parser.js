import fs from 'fs';
import readline from 'readline'
import { fromString } from 'dotosb';

export function loadBeatmap(file_path) {

  var rd = readline.createInterface({
    input: fs.createReadStream(file_path),
    console: false
  });

  let beatmap = {};
  let version = undefined;
  let group = undefined;
  let line_number = 0;
  let event_capture = "";
  rd.on('line', (line) => {
    line_number++;
    if (line === "" || line == null) return;

    if (line_number == 1) {
      beatmap.format_number = line.match(/v[0-9]+/)[0];
      version = beatmap.format_number;
      console.log(`Loading beatmap from version ${version}...`);
      return;
    }

    let line_group_info = getGroup(line, group);
    if (line_group_info.changed) {
      group = line_group_info.group.toLowerCase();
      console.log(`capturing ${group} data...`);
      beatmap[group] = group === "timingpoints" ? [] : {};
      return;
    }


    switch (group) {
      case "general":
      case "difficulty":
        const general_values = line.split(':');
        const general_key = general_values[0].trim().toLowerCase();
        const general_value = normalizeValue(general_values[1]);
        beatmap[group][general_key] = general_value;
        break;
    
      case "editor":
        const editor_values = line.split(':');
        const editor_key = editor_values[0].trim().toLowerCase();
        const editor_value = normalizeValue(editor_values[1]);

        if (editor_key === "bookmarks") {
          beatmap.editor.bookmarks = getBookmarks(editor_values[1]);
          return;
        }

        beatmap[group][editor_key] = editor_value;
        break;
      
      case "metadata":
        const metadata_values = line.split(':');
        const metadata_key = metadata_values[0].trim().toLowerCase();
        const metadata_value = normalizeValue(metadata_values[1]);

        if (metadata_key === "tags") {
          beatmap.metadata.tags = getTags(metadata_value);
          return;
        }
        beatmap[group][metadata_key] = metadata_value;
        break;
      
      case "events":
        event_capture += `${line}\n`;
        break;
      
      case "timingpoints":
        const timing_values = line.split(',');
        const timing_point = {
          type: timing_values[6] === '1' ? 'red' : 'green',
          time: parseInt(timing_values[0]),
          sampleSet: parseInt(timing_values[3]),
          sampleIndex: parseInt(timing_values[4]),
          volume: parseInt(timing_values[5]),
        };
        
        if (timing_point.type === 'red') {
          timing_point.meter = parseInt(timing_values[2]),
          timing_point.beatLength = parseFloat(timing_values[1]),
          timing_point.bpm = parseFloat((1 / timing_point.beatLength * 1000 * 60).toFixed(2));
        }

        if (timing_point.type === 'green') {
          const bdsv = parseFloat(timing_values[1]);
          timing_point.bdsv = bdsv;
          timing_point.multiplier = Math.round((1 / (bdsv > 0 ? 1.0 : -(bdsv / 100.0))) * 10) / 10;
        }

        timing_point.kiai = parseInt(timing_values[7]) & 1 == 1 ? true : false;

        beatmap.timingpoints.push(timing_point);
        break;
      
      default:
        break;
    }
  });

  rd.on('close', () => {
    beatmap.events = fromString(event_capture);
  
    console.log(beatmap); // print the result when the 'close' event is called
  });
}

function getBookmarks(line_data) {
  return line_data.split(',').map(bookmark => {
    return normalizeValue(bookmark);
  });
}

function getTags(line_data) {
  return line_data.split(' ').map(tag => {
    return tag.trim();
  });
}

function normalizeValue(value) {
  return isNaN(parseInt(value)) ? value.trim() : parseInt(value);
}

function getGroup(line, current) {
  const line_trimmed = line.trim();
  if (line_trimmed[0] == '[') {
    return {
      changed: true,
      group: line_trimmed.match(/(?!=\[)[a-zA-Z]+/)[0]
    }
  }
  
  return {
    changed: false,
    group: current
  }
}