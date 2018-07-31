import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions, 
  Animated,
  PanResponder
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class MultipleStateModal extends React.Component {

    _panResponder =  {}
    _previousTop = 0

    modalState = [];

    constructor(props) {
        super(props);

        //Convert states to list of Top
        let revertedHeightList = this.props.states.reverse();
        revertedHeightList.map((modalHeight, index) => {
            this.modalState.push(height - modalHeight);
        });
        this.modalState.push(height);

        this.state = {
            top: new Animated.Value(this.modalState[this.modalState.length - 1]),
        };

        this._previousTop = this.modalState[this.modalState.length - 1];
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

        let { isOpen, openHeight, closeTop, onClose } = this.props;
        let openTop = height - openHeight;


        if (isOpen != undefined) {
            if (!isOpen && nextProps.isOpen) {
                Animated.timing(                 
                    this.state.top,           
                    {
                        toValue: openTop,
                        duration: 400,             
                    }
                ).start(); 
                this._previousTop = openTop
            }

            if (isOpen && !nextProps.isOpen) {
                Animated.timing(                 
                    this.state.top,           
                    {
                        toValue: height,
                        duration: 400,             
                    }
                ).start(); 
                onClose != null ? this.props.onClose() : null ;
                this._previousTop = height 
            }
        } 
        
    }


    _handleStartShouldSetPanResponder(e, gestureState) {
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
        let { modalState } = this;

        let topPos = this._previousTop + gestureState.dy;
        let maxTop = modalState[modalState.length - 1];
        let minTop = modalState[0];
        
        let top = ( topPos < minTop)? minTop : ( topPos > maxTop)? maxTop : topPos;

        this.setState({
            top: new Animated.Value(top)
        })
    }

    calHeight(topPos) {
        let { onClose } = this.props;
        let { modalState } = this;
        for (i = 0; i < modalState.length; i++) { 

            if (i == modalState.length - 1) {
                onClose != null ? this.props.onClose() : null ;
                return modalState[i];
            } else if (topPos < ((modalState[i] + modalState[i+1]) / 2) ) {
                return modalState[i]
            }
        }
    }
      
    _handlePanResponderEnd(e, gestureState) {
        let topPos = this._previousTop + gestureState.dy;
        let top = this.calHeight(topPos);
        Animated.timing(                 
            this.state.top,           
            {
                toValue: top,
                duration: 300,             
            }
        ).start(); 

        this._previousTop = top;
    }

    render() {
        return (
            <Animated.View 
                style={[ 
										styles.container, {top: this.state.top}, 
                    this.props.style
                ]}
                {...this._panResponder.panHandlers}>
                {this.props.children}
            </Animated.View>
        );

    }

}

MultipleStateModal.propTypes = {
    states: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    openHeight: PropTypes.number,
    speed: PropTypes.number,
    onClose: PropTypes.func
};

MultipleStateModal.defaultProps = {
    openHeight: height / 2,
    speed: 300,
    onClose: () => null
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height,
        width,
        alignItems: 'center',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {
            height: 0,
            width: 0
        }
    },


});