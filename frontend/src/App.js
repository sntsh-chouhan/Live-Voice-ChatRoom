import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Navigation from './components/shared/Navigation/Navigation';
import Activate from './pages/Activate/Activate';
import Authenticate from './pages/Authenticate/Authenticate';
import Home from './pages/Home/Home';
import Rooms from './pages/Rooms/Rooms';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';

function App() {
    const {loading} = useLoadingWithRefresh();
    return loading? ('loading...') : (
        <BrowserRouter>
        <Navigation />
        <Switch>
            <GuestRoute path= "/" exact>
                <Home/>
            </GuestRoute>
            <GuestRoute path="/authenticate">
                <Authenticate />
            </GuestRoute>
            <SemiProtectedRoute path='/activate'>
                <Activate/>
            </SemiProtectedRoute>
            <ProtectedRoute path='/rooms'>
                <Rooms />
            </ProtectedRoute>
        </Switch>
        </BrowserRouter>
    );
}

const GuestRoute =({children, ...rest}) =>{
    const {isAuth} = useSelector((state) => state.auth);

    return(
        <Route {...rest} 
        render={({location})=>{
            return isAuth?(
               
                <Redirect to={{
                    pathname : '/rooms',
                    state: {from: location},
                }}/> 
            ):(
                children
            );
        }}>

        </Route>
    )
}

const SemiProtectedRoute=({children, ...rest})=>{
    const {user, isAuth} = useSelector((state) => state.auth);

    return <Route {...rest}
      render={({location})=>{
        return(
          !isAuth?(
            <Redirect to={{
              pathname: '/',
              state: {from: location}
            }}/>
          ):isAuth && !user.activated?(
            children
          ):(
            <Redirect to={{
              pathname : '/rooms',
              state: {from: location}
            }}/>
          )
        )
      }}
    ></Route>
};

  const ProtectedRoute=({children, ...rest})=>{
    const {user, isAuth} = useSelector((state) => state.auth);
    
    return <Route {...rest}
      render={({location})=>{
        return(
          !isAuth?(
            <Redirect to={{
              pathname: '/',
              state: {from: location}
            }}/>
          ):isAuth && !user.activated?(
            <Redirect to={{
              pathname: '/activate',
              state: {from: location}
            }}/>
          ):(
            children
          )
        )
      }}
    ></Route>
  };

export default App;
