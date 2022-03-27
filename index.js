const beatmap = require('./src/beatmap.js');
const parser = require('./src/parser.js');

exports.loadBeatmap = parser.loadBeatmap;
exports.getTimingAt = beatmap.getTimingAt;