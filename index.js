import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions, 
  TouchableOpacity,
  Image,
  Animated,
  PanResponder
} from 'react-native';
import styles from './styles';


const { width, height } = Dimensions.get('window');

export default class MultipleStateModal extends React.Component {

    _panResponder =  {}
    _previousTop = 0
    //circle = (null : ?{ setNativeProps(props: Object): void }),

    constructor(props) {
        super(props);

        this.state = {
            top: new Animated.Value(this.props.modalState[this.props.modalState.length - 1]),
        };

        this._previousTop = this.props.modalState[this.props.modalState.length - 1];
    }


    componentWillMount() {
        
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => this._handleStartShouldSetPanResponder(e, gestureState),
            onMoveShouldSetPanResponder: (e, gestureState) => this._handleMoveShouldSetPanResponder(e, gestureState),
            onPanResponderGrant: (e, gestureState) => this._handlePanResponderGrant(e, gestureState),
            onPanResponderMove: (e, gestureState) => this._handlePanResponderMove(e, gestureState),
            onPanResponderRelease: (e, gestureState) => this._handlePanResponderEnd(e, gestureState),
            onPanResponderTerminate: (e, gestureState) => this._handlePanResponderEnd(e, gestureState),
        });

    }

    componentWillReceiveProps(nextProps) {

        let { openFlag, openTop, closeTop } = this.props;
        if (openFlag != undefined) {
            if (!openFlag && nextProps.openFlag) {
                Animated.timing(                  // Animate over time
                    this.state.top,           
                    {
                        toValue: openTop,
                        duration: 200,              // Make it take a while
                    }
                ).start(); 
                this._previousTop = openTop
            }

            if (openFlag && !nextProps.openFlag) {
                Animated.timing(                  // Animate over time
                    this.state.top,           
                    {
                        toValue: closeTop,
                        duration: 200,              // Make it take a while
                    }
                ).start(); 
                this._previousTop = closeTop 
            }
        } 
        
    }


    _handleStartShouldSetPanResponder(e, gestureState) {
        // Should we become active when the user presses down on the circle?
        return true;
    }
    
    _handleMoveShouldSetPanResponder(e, gestureState) {
        var dx = gestureState.dx;
        var dy = gestureState.dy;
        if (dx != 0 && dy == 0) {
          return true;
        }
        return false;
    }
    
    _handlePanResponderGrant(e, gestureState) {
        //this._highlight();
    }

    _handlePanResponderMove(e, gestureState) {
        let topPos = this._previousTop + gestureState.dy;
        let { modalState } = this.props;
        let maxTop = modalState[modalState.length - 1];
        let minTop = modalState[0];
        
        let top = ( topPos < minTop)? minTop : ( topPos > maxTop)? maxTop : topPos;

        this.setState({
            top: new Animated.Value(top)
        })
    }

    calHeight(topPos) {
        let { modalState, onCloseTop } = this.props;

        for (i = 0; i < modalState.length; i++) { 

            if (i == modalState.length - 1) {
                onCloseTop != null ? this.props.onCloseTop() : null ;
                return modalState[i];
            } else if (topPos < ((modalState[i] + modalState[i+1]) / 2) ) {
                return modalState[i]
            }
        }
    }
      
    _handlePanResponderEnd(e, gestureState) {
        let topPos = this._previousTop + gestureState.dy;
        let top = this.calHeight(topPos);
        Animated.timing(                  // Animate over time
            this.state.top,           
            {
                toValue: top,
                duration: 300,              // Make it take a while
            }
        ).start(); 

        this._previousTop = top;
    }

    render() {
        return (
            <Animated.View 
                style={[
                    this.props.style, 
                    styles.container, {top: this.state.top}
                ]}
                {...this._panResponder.panHandlers}>
                {this.props.children}
            </Animated.View>
        );

    }

}
