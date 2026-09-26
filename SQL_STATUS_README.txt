PLAN:ON SQL 안내

이번 버전에서 새 SQL 1개가 필요합니다.

1) 기존 PLANON SQL을 이미 모두 적용한 사용자
   -> RUN_THIS_LOCATION_PERMISSION.sql 을 Supabase SQL Editor에서 1회 실행하세요.

2) 새 프로젝트를 처음 만드는 경우
   -> supabase/000_full_schema.sql 최신본에 위치 권한 테이블까지 포함되어 있습니다.

위치 권한 테이블은 GPS 좌표를 저장하지 않습니다.
저장되는 값은 계정별 현재 위치 사용 동의 여부(enabled true/false)뿐입니다.
브라우저/아이폰의 실제 위치 권한은 사용자가 직접 허용해야 하며 SQL로 강제로 허용할 수 없습니다.
