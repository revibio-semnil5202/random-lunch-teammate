# Supabase SQL 마이그레이션

> Supabase SQL Editor에 아래 전체를 복붙하여 한 번에 실행.

```sql
-- ============================================================
-- 1. 기존 테이블 삭제 (초기화 시에만)
-- ============================================================
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- ============================================================
-- 2. members
-- ============================================================
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL,
  department VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE members IS '참여자';
COMMENT ON COLUMN members.name IS '이름 (최대 10글자)';
COMMENT ON COLUMN members.department IS '소속 팀 (프리셋 또는 직접 입력)';

-- ============================================================
-- 3. group_configs (어드민 그룹 설정 템플릿)
-- ============================================================
CREATE TABLE group_configs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  schedule JSONB NOT NULL DEFAULT '["수"]',
  max_participants INTEGER NOT NULL DEFAULT 12,
  match_deadline_time VARCHAR(5) NOT NULL DEFAULT '11:00',
  slack_channel_url VARCHAR(500),
  slack_webhook_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE group_configs IS '어드민 그룹 설정 템플릿';
COMMENT ON COLUMN group_configs.schedule IS '요일 로테이션 배열 (ex: ["수","목"] → 수→목 반복)';
COMMENT ON COLUMN group_configs.max_participants IS '최대 참여 인원 (최소 3)';
COMMENT ON COLUMN group_configs.match_deadline_time IS '매칭 마감 시각 (HH:MM)';
COMMENT ON COLUMN group_configs.slack_webhook_url IS '슬랙 Incoming Webhook URL (알림 발송용)';

ALTER TABLE group_configs
  ADD CONSTRAINT chk_schedule_not_empty
  CHECK (jsonb_array_length(schedule) > 0);

ALTER TABLE group_configs
  ADD CONSTRAINT chk_max_participants_min
  CHECK (max_participants >= 3);

-- ============================================================
-- 4. lunch_events (각 회차 점심 이벤트)
-- ============================================================
CREATE TABLE lunch_events (
  id SERIAL PRIMARY KEY,
  group_config_id INTEGER NOT NULL
    REFERENCES group_configs(id) ON DELETE CASCADE,
  lunch_date DATE NOT NULL,
  match_deadline TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'recruiting',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE lunch_events IS '각 회차 점심 이벤트';
COMMENT ON COLUMN lunch_events.status IS 'recruiting | matched';

ALTER TABLE lunch_events
  ADD CONSTRAINT chk_status
  CHECK (status IN ('recruiting', 'matched'));

-- 같은 그룹 + 같은 날짜 중복 방지
CREATE UNIQUE INDEX idx_lunch_events_unique
  ON lunch_events(group_config_id, lunch_date);

-- ============================================================
-- 5. event_participants (이벤트 참여자)
-- ============================================================
CREATE TABLE event_participants (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL
    REFERENCES lunch_events(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL
    REFERENCES members(id) ON DELETE CASCADE,
  cancelled_at TIMESTAMP,
  cancel_reason VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE event_participants IS '이벤트 참여자';
COMMENT ON COLUMN event_participants.cancelled_at IS '미참 처리 시각 (NULL이면 참여 중)';
COMMENT ON COLUMN event_participants.cancel_reason IS '미참 사유 (개인사정, 휴가, 직접 입력)';

-- 동일 이벤트에 같은 멤버 중복 참여 방지
CREATE UNIQUE INDEX idx_event_participants_unique
  ON event_participants(event_id, member_id);

-- ============================================================
-- 6. match_results (매칭 결과 - 조 배정)
-- ============================================================
CREATE TABLE match_results (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL
    REFERENCES lunch_events(id) ON DELETE CASCADE,
  match_group_index INTEGER NOT NULL,
  member_id INTEGER NOT NULL
    REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE match_results IS '매칭 결과 (조 배정)';
COMMENT ON COLUMN match_results.match_group_index IS '조 번호 (1, 2, 3...)';

-- 같은 이벤트 + 같은 멤버 중복 방지
CREATE UNIQUE INDEX idx_match_results_unique
  ON match_results(event_id, member_id);

-- ============================================================
-- 7. RLS (Row Level Security)
-- ============================================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunch_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

-- 일반 사용자 (anon): 읽기
CREATE POLICY "anon_select_members" ON members FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_lunch_events" ON lunch_events FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_event_participants" ON event_participants FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_match_results" ON match_results FOR SELECT TO anon USING (true);

-- 일반 사용자 (anon): 참여자 등록/미참 처리
CREATE POLICY "anon_insert_members" ON members FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_event_participants" ON event_participants FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_event_participants" ON event_participants FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 어드민 (authenticated): 모든 테이블 전체 권한
CREATE POLICY "auth_all_group_configs" ON group_configs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_lunch_events" ON lunch_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_members" ON members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_event_participants" ON event_participants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_match_results" ON match_results FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 8. 인덱스 (조회 성능)
-- ============================================================
CREATE INDEX idx_lunch_events_status ON lunch_events(status, lunch_date DESC);
CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_match_results_event ON match_results(event_id, match_group_index);
```
