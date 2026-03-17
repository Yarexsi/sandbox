const sessions = {}

export function getSession(user){

  if(!sessions[user]){
    sessions[user] = {
      step: "start",
      estacion: null
    }
  }

  return sessions[user]
}

export function updateSession(user,data){

  sessions[user] = {
    ...sessions[user],
    ...data
  }

}
