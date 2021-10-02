import { combineReducers, createStore } from "redux";
import { loginReducer } from "../reducer/loginReducer";



const rootReducer = combineReducers({
    login:loginReducer,
})

 

const configureStore = () => { 
    return createStore(
            rootReducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
            );
    
};

  
export default configureStore;