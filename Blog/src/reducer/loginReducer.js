import {Types} from '../actions/actionsType'

let user = JSON.parse(localStorage.getItem('user'));


const initialState = user ? { loggedIn: true, user } : {};


export function loginReducer(state=initialState, action) {
  
  switch (action.type) {
    case Types.LOGIN:
      window.localStorage.setItem("user", JSON.stringify(action.payload.user))
      return action.payload.user
    case Types.DELETEUSER:
      window.localStorage.removeItem("user", JSON.stringify(action.payload.user))
      return action.payload  
   
      
    default:
      return state
  }
}