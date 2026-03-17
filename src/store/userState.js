const users = {}

export const getUserState = (user) => {
  if(!users[user]){
    users[user] = {
      step: "WELCOME",
      data: {}
    }
  }
  return users[user]
}

export const setUserState = (user, newState) => {
  users[user] = {
    ...users[user],
    ...newState
  }
}