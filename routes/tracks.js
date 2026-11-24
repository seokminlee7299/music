const express = require('express');
const router = express.Router();
const pool = require('../db');

// 곡 상세 + 연결된 청취 기록 목록 조회
router.get('/:id', async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);
    if (!Number.isInteger(trackId) || trackId <= 0) {
      return res.status(400).send('잘못된 곡 ID입니다.');
    }

    const [[track]] = await pool.query('SELECT * FROM tracks WHERE id = ?', [trackId]);
    if (!track) {
      return res.status(404).send('곡을 찾을 수 없습니다.');
    }

    const [logs] = await pool.query(
      'SELECT * FROM listening_logs WHERE track_id = ? ORDER BY listened_on DESC, id DESC',
      [trackId]
    );

    res.render('detail', { track, logs });
  } catch (err) {
    next(err);
  }
});

// 곡 수정 폼 렌더링
router.get('/:id/edit', async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);
    if (!Number.isInteger(trackId) || trackId <= 0) {
      return res.status(400).send('잘못된 곡 ID입니다.');
    }

    const [[track]] = await pool.query('SELECT * FROM tracks WHERE id = ?', [trackId]);
    if (!track) {
      return res.status(404).send('곡을 찾을 수 없습니다.');
    }

    res.render('edit', { track });
  } catch (err) {
    next(err);
  }
});

// 곡 정보 수정 처리
router.post('/:id/update', async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);
    const { title, artist, genre, mood, release_year, recommend_reason } = req.body;
    const yearValue = release_year ? Number(release_year) : null;

    await pool.query(
      `UPDATE tracks
       SET title = ?, artist = ?, genre = ?, mood = ?, release_year = ?, recommend_reason = ?
       WHERE id = ?`,
      [
        title.trim(),
        artist.trim(),
        genre.trim(),
        mood.trim(),
        yearValue,
        recommend_reason.trim(),
        trackId
      ]
    );

    res.redirect(`/tracks/${trackId}`);
  } catch (err) {
    next(err);
  }
});

// 곡 삭제 처리
router.post('/:id/delete', async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);
    await pool.query('DELETE FROM tracks WHERE id = ?', [trackId]);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// 청취 기록 추가
router.post('/:id/logs', async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);
    const { listened_on, rating, memo } = req.body;

    await pool.query(
      `INSERT INTO listening_logs (track_id, listened_on, rating, memo)
       VALUES (?, ?, ?, ?)`,
      [trackId, listened_on, Number(rating), memo.trim()]
    );

    res.redirect(`/tracks/${trackId}`);
  } catch (err) {
    next(err);
  }
});

// 청취 기록 삭제
router.post('/:id/logs/:logId/delete', async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);
    const logId = Number(req.params.logId);

    await pool.query(
      'DELETE FROM listening_logs WHERE id = ? AND track_id = ?',
      [logId, trackId]
    );

    res.redirect(`/tracks/${trackId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
