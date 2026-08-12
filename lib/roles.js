// Canonical roster roles and their default avatars. Pure and dependency-free so
// it's safe to import from both browser code (AdminSettingsPage.jsx) and
// serverless routes (api/members.js, api/auth.js) without pulling in the
// database client.

export const MEMBER_ROLES = [
  'Pending',
  'Active Member',
  'Director',
  'Committee Chair',
  'OI Representative',
  'Past President',
  'Vice President',
  'President',
  'Treasurer',
  'Secretary',
  'Public Relations Officer (PRO)'
];

const ROLE_AVATARS = {
  'Pending': '/avatars/active_member_icon.jpg',
  'Active Member': '/avatars/active_member_icon.jpg',
  'Director': '/avatars/director_placeholder.jpg',
  'Committee Chair': '/avatars/committee_chairs_placeholder.jpg',
  // OI Representative and Past President share one image per club convention.
  'OI Representative': '/avatars/board_group_placeholder.jpg',
  'Past President': '/avatars/board_group_placeholder.jpg',
  'Vice President': '/avatars/vice_president_placeholder.jpg',
  'President': '/avatars/president_placeholder.jpg',
  'Treasurer': '/avatars/treasurer_placeholder.jpg',
  'Secretary': '/avatars/secretary_placeholder.jpg',
  'Public Relations Officer (PRO)': '/avatars/pro_placeholder.jpg'
};

const DEFAULT_AVATAR = '/avatars/active_member_icon.jpg';

export function getDefaultAvatarForRole(role) {
  return ROLE_AVATARS[role] || DEFAULT_AVATAR;
}
