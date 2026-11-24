CREATE DATABASE IF NOT EXISTS musicdb
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE musicdb;

-- 1. 대표 곡 정보 테이블 (부모 테이블)
CREATE TABLE tracks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  artist VARCHAR(120) NOT NULL,
  genre VARCHAR(60) NOT NULL,
  mood VARCHAR(60) NOT NULL,
  release_year SMALLINT UNSIGNED NULL,
  recommend_reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 청취 기록 및 감상 메모 테이블 (자식 테이블)
CREATE TABLE listening_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  track_id INT NOT NULL,
  listened_on DATE NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  memo VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_logs_track
    FOREIGN KEY (track_id) REFERENCES tracks(id)
    ON DELETE CASCADE
);

-- 3. 테스트용 샘플 데이터 (곡 2건)
INSERT INTO tracks (title, artist, genre, mood, release_year, recommend_reason)
VALUES
  ('Why So Lonely', '원더걸스', '레게 팝', '여유로운', 2016, '담백한 가사와 레게 리듬이 밤에 혼자 걸을 때 잘 어울립니다.'),
  ('LOVE ATTACK', '리센느', '댄스 팝', '경쾌한', 2024, '청량하고 밝은 분위기와 중독성이 있는 멜로디가 어우러져 기분 좋게 들을 수 있는 곡입니다.');

-- 4. 테스트용 청취 기록 샘플 데이터 (위에서 들어간 id 1, 2번 곡 기준)
INSERT INTO listening_logs (track_id, listened_on, rating, memo)
VALUES
  (1, '2026-11-20', 5, '이어폰으로 들으니 베이스 라인이 선명하게 들림.'),
  (1, '2026-11-22', 4, '비 오기 직전 선선한 저녁에 다시 틀어봄.'),
  (2, '2026-11-23', 5, '새벽 공부할 때 틀어두기 좋은 곡.');
