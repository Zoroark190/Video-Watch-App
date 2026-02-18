export const USERS = ['James', 'Mimi']

export function getOtherUser(currentUser) {
  return USERS.find((u) => u !== currentUser)
}

export const STATUS = {
  WATCHED: 'watched',
  GOING_TODAY: 'going_today',
  GOING_FUTURE: 'going_future',
  NOT_INTERESTED: 'not_interested',
}
