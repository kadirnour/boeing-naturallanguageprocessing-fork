import React from 'react';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

class NavBar extends React.Component {
    
    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: render
    Description: renders navigation and progress bar
    '''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    render() {
        return (
            <div className="section navbar">
                <div className="container">
                    <div className="navbar-wrapper">
                        <div className="progress-bar__numbers">
                            <ProgressBar percent={this.props.mode} height="3px" filledBackground="orange">
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__numbers ${accomplished ? "numbers--accomplished" : null}`}>
                                            1
                                        </div>
                                    )}
                                </Step>
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__numbers ${accomplished ? "numbers--accomplished" : null}`}>
                                            2
                                        </div>
                                    )}
                                </Step>
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__numbers ${accomplished ? "numbers--accomplished" : null}`}>
                                            3
                                        </div>
                                    )}
                                </Step>
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__numbers ${accomplished ? "numbers--accomplished" : null}`}>
                                            4
                                        </div>
                                    )}
                                </Step>
                            </ProgressBar>
                        </div>
                        <div className="progress-bar__labels">
                            <ProgressBar percent={this.props.mode} height="0px" filledBackground="orange">
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__labels ${accomplished ? "labels--accomplished" : null}`}> 
                                            DOCUMENTS
                                        </div>
                                    )}
                                </Step>
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__labels ${accomplished ? "labels--accomplished" : null}`}>
                                            TERMS
                                        </div>
                                    )}
                                </Step>
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__labels ${accomplished ? "labels--accomplished" : null}`}>
                                            CATEGORIES
                                        </div>
                                    )}
                                </Step>
                                <Step>
                                    {({accomplished}) => (
                                        <div className={`indexed-step__labels ${accomplished ? "labels--accomplished" : null}`}>
                                            TAXONOMY
                                        </div>
                                    )}
                                </Step>
                            </ProgressBar>
                        </div>
                        {/* <div>
                            <img className="navbar-logo" src={logo}/>
                        </div> */}
                    </div>
                </div>
            </div>
        ); 
    }
}

export default NavBar;