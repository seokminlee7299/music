const express = require('express');
const router = express.Router();
const pool = require('../db');

// 최애곡 목록 조회 + 필터링 + 감상 기록 집계
router.get('/', async (req, res, next) => {
  try {
    const { genre = '', mood = '' } = req.query;

    let sql = `
      SELECT
        t.*,
        COUNT(l.id) AS log_count,
        ROUND(AVG(l.rating), 1) AS avg_rating
      FROM tracks t
      LEFT JOIN listening_logs l ON t.id = l.track_id
      WHERE 1=1
    `;
    const params = [];

    if (genre.trim()) {
      sql += ' AND t.genre = ?';
      params.push(genre.trim());
    }
    if (mood.trim()) {
      sql += ' AND t.mood = ?';
      params.push(mood.trim());
    }

    sql += ' GROUP BY t.id ORDER BY t.created_at DESC, t.id DESC';

    const [tracks] = await pool.query(sql, params);
    res.render('index', {
      tracks,
      filters: { genre: genre.trim(), mood: mood.trim() }
    });
  } catch (err) {
    next(err);
  }
});

// 새 최애곡 등록
router.post('/tracks', async (req, res, next) => {
  try {
    const { title, artist, genre, mood, release_year, recommend_reason } = req.body;

    if (!title || !artist || !genre || !mood || !recommend_reason) {
      return res.status(400).send('필수 항목을 모두 입력해 주세요.');
    }

    const yearValue = release_year ? Number(release_year) : null;

    const [result] = await pool.query(
      `INSERT INTO tracks (title, artist, genre, mood, release_year, recommend_reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        artist.trim(),
        genre.trim(),
        mood.trim(),
        yearValue,
        recommend_reason.trim()
      ]
    );

    res.redirect(`/tracks/${result.insertId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
