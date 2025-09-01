// MongoDB 초기화 스크립트
db = db.getSiblingDB('mountain');

// 사용자 생성
db.createUser({
  user: 'mountain_user',
  pwd: 'mountain_password',
  roles: [
    {
      role: 'readWrite',
      db: 'mountain'
    }
  ]
});

// 초기 컬렉션 생성 (선택사항)
db.createCollection('users');
db.createCollection('auths');

print('MongoDB initialization completed for mountain database');
