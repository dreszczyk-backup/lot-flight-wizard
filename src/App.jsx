import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import {
    Wizard,
} from './pages';

class AppRoot extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <Router>
                <Route
                    exact
                    path='/'
                    component={Wizard}
                />
            </Router>
        );
    }
}

export default AppRoot;
