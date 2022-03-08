import React from 'react';
import logo from '../images/logo.png';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
///images/brandon.png';
//import kadir from '../images/kadir.png';
//import riley from '../images/riley.png';
//import don from '../images/don.png';
//import rocki from '../images/rocki.png';

// Displays a navbar and shows current progress in webpage
class NavBar extends React.Component {
    
    render() {
        return (
            <div className="navbar">
                <div className="progressBar">
                    <div className="progressBar1">
                        <ProgressBar percent={this.props.mode} height="3px" filledBackground="lightblue">
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep1 ${accomplished ? "accomplished" : null}`}>
                                            1
                                    </div>
                                )}
                            </Step>
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep1 ${accomplished ? "accomplished" : null}`}>
                                            2
                                    </div>
                                )}
                            </Step>
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep1 ${accomplished ? "accomplished" : null}`}>
                                            3
                                    </div>
                                )}
                            </Step>
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep1 ${accomplished ? "accomplished" : null}`}>
                                            4
                                    </div>
                                )}
                            </Step>
                        </ProgressBar>
                    </div>
                    <div className="progressBar2">
                        <ProgressBar percent={this.props.mode} height="0px" filledBackground="lightblue">
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep2 ${accomplished ? "accomplished2" : null}`}> 
                                        DOCUMENTS
                                    </div>
                                )}
                            </Step>
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep2 ${accomplished ? "accomplished2" : null}`}>
                                        TERMS
                                    </div>
                                )}
                            </Step>
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep2 ${accomplished ? "accomplished2" : null}`}>
                                        CATEGORIES
                                    </div>
                                )}
                            </Step>
                            <Step>
                                {({ accomplished }) => (
                                    <div className={`indexedStep2 ${accomplished ? "accomplished2" : null}`}>
                                        TAXONOMY
                                    </div>
                                )}
                            </Step>
                        </ProgressBar>
                    </div>
                    <div>
                        <img className="navbarLogo" src={logo}/>
                    </div>
                </div>
            </div>
        ); 
    }
}

export default NavBar;