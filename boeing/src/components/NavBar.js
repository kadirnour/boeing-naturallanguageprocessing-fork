import React from 'react';

import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

class NavBar extends React.Component {
    
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
            </div>
        ); 
    }
}

export default NavBar;