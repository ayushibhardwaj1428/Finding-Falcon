import React from 'react';
import { BrowserRouter as Router, Route,  Switch } from 'react-router-dom';
import FindFalcon from '../components/findFalcon';
import Result from '../components/result';
import Header from '../components/header';
import Footer from '../components/footer';

function AppRouter() {
  return (
    <Router>
     <Header></Header>
      <Switch>
        <Route path="/" exact component={FindFalcon} />
        <Route path="/result" component={Result} />
      </Switch>
      <Footer></Footer>
    </Router>
  );
}

export default AppRouter;
