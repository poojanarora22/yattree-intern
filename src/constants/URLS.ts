const BASE_URL = 'https://yaatrees-api-staging.thinkwik.dev:3000/api/v1/';

const URL = {
  REFRESH_TOKEN: 'auth/token/refresh',
  USERNAME_AVAILABLE: 'auth/available/userName/',
  EMAIL_AVAILABLE: 'auth/available/email/',
  SEND_OTP: 'auth/sendVerifyOtp',
  VERIFY_OTP: 'auth/verifyOtp',
  SEND_EMAIL: 'auth/resendVerifyEmail',
  VERIFY_EMAIL: 'auth/verify-email?',
  GET_UPLOAD_URL: 'file/getUploadUrl',
  REGISTER: 'auth/register',
  LOGIN: 'auth/login',
  SOCIAL_LOGIN: 'auth/socialLogin',
  UPDATE_PROFILE: 'auth/me',
  FORGOT_PASSWORD: 'auth/forgotPassword',
  RESET_PASSWORD: 'auth/resetPassword',
  CHANGE_PASSWORD: 'auth/password',
  ADD_TOUR: 'tour',
  EVENT_CATEGORY: 'subCategory?subCategoryType=EVENT',
  ACTIVITY_CATEGORY: 'subCategory?subCategoryType=ACTIVITY',
  GET_INTEREST_LIST: 'public/interests',
  GET_COUNTRIES_LIST: 'https://d102qy2ikrp4zx.cloudfront.net/countries.json',
  GET_TOUR_LIST: 'tour/query',
  GET_USER_TOUR_LIST: 'tour/myTours/query',
  GET_TOUR_DETAIL: 'tour/',
  GET_MY_PROFILE: 'auth/me',
  NOTIFICATION: 'settings/notification',
  PERMISSION: 'settings/permission',
  GET_ABOUT_US: 'public/aboutUs',
  GET_PRIVACY_POLICY: 'public/privacyPolicy',
  GET_TERMS_CONDITIONS: 'public/termsAndConditions',
  CONTACT_US: 'public/contactUs',
  DELETE_ACCOUNT: 'auth/me',
  GET_FORUM_LIST: 'forum/query',
  ADD_FORUM: 'forum',
  GET_FORUM_DETAILS: 'forum/',
  DELETE_FORUM: 'forum/',
  GET_USER_LOCATION: 'user/location',
  ADD_COMMENT: 'comment',
  GET_TOUR_COMMENTS: 'comment/tour/',
  GET_FORUM_COMMENTS: 'comment/forum/',
  UPDATE_FIRST_LOGIN: 'user/updateFirstLogin',
  LIKE_POST: 'like',
  UNLIKE_POST: 'like/',
  GET_OTHER_USER_PROFILE: 'user/',
  FOLLOW_USER: 'follow',
  UNFOLLOW_USER: 'follow/unFollow',
  REPORT: 'report',
  BLOCK: 'user/block',
  GET_SOS_LIST: 'sos',
  JOIN_TOUR: 'participants/join',
  GET_PARTICIPANT_LIST: 'participants',
  DELETE_TOUR: 'tour/',
  SEARCH: 'search',
  RATING: 'rating',
  GET_NOTIFICATION_LIST: 'notification',
  ACCEPT_FOLLOW_REQUEST: 'follow/acceptRequest',
  REJECT_FOLLOW_REQUEST: 'follow/rejectRequest',
  ACCEPT_PARTICIPANTS_REQUEST: 'participants/accept',
  REJECT_PARTICIPANTS_REQUEST: 'participants/reject',
  GET_MY_RATINGS: 'rating',
  GET_USER_RATINGS: 'rating/all',
  NOTIFICATION_TOKEN: 'auth/token',
  CREATE_SUBSCRIPTION: 'subscription',
};

export {URL, BASE_URL};