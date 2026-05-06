-- =============================================================
-- 상상우리 매칭 시스템 초기 스키마
-- 학습 환경: RLS 비활성화 (실서비스 전 반드시 재설계)
-- =============================================================

-- seniors: 시니어 프로필
CREATE TABLE IF NOT EXISTS seniors (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  region        TEXT        NOT NULL,
  desired_job   TEXT        NOT NULL,
  career_years  INTEGER     NOT NULL CHECK (career_years >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- jobs: 등록된 일자리
CREATE TABLE IF NOT EXISTS jobs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  region           TEXT        NOT NULL,
  job_type         TEXT        NOT NULL,
  required_career  INTEGER     NOT NULL DEFAULT 0 CHECK (required_career >= 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- matches: 매칭 결과 (senior ↔ job)
CREATE TABLE IF NOT EXISTS matches (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id  UUID        NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  job_id     UUID        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  score      INTEGER     NOT NULL DEFAULT 0,
  status     TEXT        NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('unmatched', 'pending', 'assigned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_matches_senior_id ON matches(senior_id);
CREATE INDEX IF NOT EXISTS idx_matches_job_id    ON matches(job_id);
CREATE INDEX IF NOT EXISTS idx_matches_score     ON matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status    ON matches(status);

-- =============================================================
-- RLS 비활성화 (학습 환경 전용)
-- =============================================================
ALTER TABLE seniors DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs    DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
