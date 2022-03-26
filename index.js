const beatmap = require('./src/beatmap.js');
const parser = require('./src/parser.js');

exports.loadBeatmap = parser.loadbeatmap;
exports.getTimingAt = beatmap.getTimingAt;