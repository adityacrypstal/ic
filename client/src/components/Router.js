import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import { Route, Link, Router, Switch} from 'react-router-dom'
import Home from './Home'
import history from "../helpers/history"
class Routes extends Component {
    componentDidMount() {
        history.push('/aq-index')
    }

    render(){
        return(
            <Router history={history}>
            <Switch>
                <Route exact path="/aq-index" component={Home} />
            </Switch>
        </Router>
        )
    }
}
 export default Routes