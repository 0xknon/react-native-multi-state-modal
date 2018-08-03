import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions, 
  Animated,
  PanResponder
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export default class MultipleStateModal extends React.Component {

	_panResponder =  {}
	_previousTop = 0

	modalState = [];

	constructor(props) {
		super(props);
		const { states, openHeight, stateIndex } = props
		//Convert states to list of Top
		let revertedHeightList = states.reverse();
		revertedHeightList.map((modalHeight, index) => {
				this.modalState.push(SCREEN_HEIGHT - modalHeight);
		});
		
		const nextModalStateIndex = this.getCorrectedStateIndex(stateIndex)
		this.state = {
			top: new Animated.Value(this.modalState[nextModalStateIndex]),
		};

		this._previousTop = this.modalState[nextModalStateIndex];
	}

	getCorrectedStateIndex = (stateIndex) => {
		return this.modalState.length - 1 - stateIndex
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

		let { stateIndex } = this.props;

		if (stateIndex != nextProps.stateIndex) {
			const nextModalStateIndex = this.getCorrectedStateIndex(nextProps.stateIndex)
			Animated.timing(                 
				this.state.top,           
				{
					// toValue: this.modalState[1],
					toValue: this.modalState[nextModalStateIndex],
					duration: 400,             
				}
			).start(); 
			// this._previousTop = this.modalState[1]
			this._previousTop = this.modalState[nextModalStateIndex]
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
		//OnPress
		const { enableDrag, onPress } = this.props
		if (!enableDrag && onPress) {
			onPress()
		}
	}

	_handlePanResponderMove(e, gestureState) {
		if (this.props.enableDrag) {
			let { modalState } = this;

			let topPos = this._previousTop + gestureState.dy;
			let maxTop = modalState[modalState.length - 1];
			let minTop = modalState[0];
			
			let top = ( topPos < minTop)? minTop : ( topPos > maxTop)? maxTop : topPos;

			this.setState({
					top: new Animated.Value(top)
			})
		}
	}

	_handlePanResponderEnd(e, gestureState) {
		if (this.props.enableDrag) {
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
	}

	calHeight(topPos) {
		let { modalState } = this;
		for (i = 0; i < modalState.length; i++) { 

			if (i == modalState.length - 1) {
				return modalState[i];
			} else if (topPos < ((modalState[i] + modalState[i+1]) / 2) ) {
				return modalState[i]
			}
		}
	}
		

	render() {
		const { enableDrag } = this.props
		return (
			<Animated.View 
				style={[ 
					styles.container, {top: this.state.top}, 
					this.props.style
				]}
				{...this._panResponder.panHandlers} >
				{this.props.children}
			</Animated.View>
		);

	}

}

MultipleStateModal.propTypes = {
	states: PropTypes.array.isRequired,
	stateIndex: PropTypes.number.isRequired,
	enableDrag: PropTypes.bool,
	onPress: PropTypes.func,
	speed: PropTypes.number
};

MultipleStateModal.defaultProps = {
	enableDrag: true,
	onPress: null,
	// openHeight: SCREEN_HEIGHT / 2,
	speed: 300
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		height: SCREEN_HEIGHT,
		width: SCREEN_WIDTH,
		alignItems: 'center',
		shadowOpacity: 0.5,
		shadowRadius: 4,
		shadowOffset: {
			height: 0,
			width: 0
		}
	},
});