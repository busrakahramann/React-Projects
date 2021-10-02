import {Types} from "./actionsType"



export function onLogin(user) {
    console.log(user);
    return {
        type: Types.LOGIN,
        payload: {
            user: user,
        },
    };
}
export function onDelete() {
    return {
        type: Types.DELETEUSER,
        payload: {
            user:"",
            loggedIn:false

        },
    };
}