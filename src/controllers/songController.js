const Song = require('../models/songModel');

// Create a new song
const createSong = async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a song
const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a song
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get statistics
const getStats = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Song.distinct('artist').then((artists) => artists.length);
    const totalAlbums = await Song.distinct('album').then((albums) => albums.length);
    const totalGenres = await Song.distinct('genre').then((genres) => genres.length);

    const songsByGenre = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } }
    ]);

    const songsByArtist = await Song.aggregate([
      { $group: { _id: '$artist', songs: { $sum: 1 }, albums: { $addToSet: '$album' } } },
      { $project: { _id: 1, songs: 1, albums: { $size: '$albums' } } }
    ]);

    const songsByAlbum = await Song.aggregate([
      { $group: { _id: '$album', count: { $sum: 1 } } }
    ]);

    res.json({
      totalSongs,
      totalArtists,
      totalAlbums,
      totalGenres,
      songsByGenre,
      songsByArtist,
      songsByAlbum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSong,
  getAllSongs,
  updateSong,
  deleteSong,
  getStats
};
