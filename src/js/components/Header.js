'use strict';
import React from 'react';
import Minimize from './Header/Minimize';
import Quit from './Header/Quit';
export default class Header extends React.Component {
    render() {
        return (
            <header>
                <span>Melodii Music Player</span>
                <div id='headerIcons'>
                    <Minimize />
                    <Quit />
                </div>
            </header>
        )
    }
}