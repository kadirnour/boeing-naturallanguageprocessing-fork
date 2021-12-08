import React from 'react';
import logo from '../images/boeing logo.jpg';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

class NavBar extends React.Component {
    
    /**
     * Shows progress through app on the top bar. 
     * @returns navbar on top of all the pages
     */
    render() {
        return (
            <div className="navBar">
                <div className="navBarProgress1">
                    <ProgressBar percent={this.props.mode} height="3px" filledBackground="lightgreen">
                        <Step>
                            {({ accomplished }) => (
                                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}> 
                                    1
                                </div>
                            )}
                        </Step>
                        <Step>
                            {({ accomplished }) => (
                                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                                    2
                                </div>
                            )}
                        </Step>
                        <Step>
                            {({ accomplished }) => (
                                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                                    3
                                </div>
                            )}
                        </Step>
                        <Step>
                            {({ accomplished }) => (
                                <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
                                    4
                                </div>
                            )}
                        </Step>
                    </ProgressBar>
                </div>
                <div className="navBarProgress2">
                    <ProgressBar percent={this.props.mode} height="0px" filledBackground="lightgreen">
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
                <img className="navbarLogo" src={logo}/>
                <img className="navbarLogo2" src={logo}/>
            </div>
        ); 
    }
}

export default NavBar;