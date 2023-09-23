enum ErrorCode {
  // 인증 관련 에러 코드
  INVALID_ACCESS_TOKEN = 1000, // 변조된 access
  EXPIRED_ACCESS_TOKEN = 1001, // access 토큰 시간 만료
  INVALID_REFRESH_TOKEN = 1002, // 변조된 refresh 토큰
  EXPIRED_REFRESH_TOKEN = 1003, // refresh 토큰 시간 만료
  NO_ACCESS_TOKEN_IN_HEADER = 1004, // access 토큰이 헤더에 없는 경우
  NO_REFRESH_TOKEN_IN_HEADER = 1005, // refresh 토큰이 헤더에 없는 경우

  // 유저 관련 에러 코드
  USER_NOT_FOUND = 1100, // 존재하지 않는 유저에 대한 접근

  // 편지 관련 에러 코드
  LETTER_NOT_FOUND = 1200, // 존재하지 않는 편지에 대한 접근
  LETTER_INCLUDE_SLANG = 1201, // 편지 내용에 비속어 포함
  LETTER_POINT_NOT_ENOUGH = 1202, // 편지를 읽으려는데 포인트 부족
  LETTER_TOO_SHORT = 1203, // 메세지가 너무 짧음
  LETTER_TOO_LONG = 1204, // 메세지가 너무 김
  LETTER_NOT_LEFT = 1205, // 존재하는 편지를 다 읽은 경우

  // API 요청 에러
  INVALID_QUERY = 2000, // 잘못된 쿼리 전송

  // 기타 에러
  UNCATCHED_ERROR = 3000, // 예상 못한 에러
}

export default ErrorCode;
