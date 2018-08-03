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
	_previousHeight = 0

	modalState = [];

	constructor(props) {
		super(props);
		const { states, stateIndex } = props
		
		this.modalState = states
		
		this.state = {
			index: stateIndex,
			height: new Animated.Value(this.modalState[stateIndex]),
		};

		this._previousHeight = this.modalState[stateIndex];
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

		let { states, stateIndex } = this.props;

		if (stateIndex != nextProps.stateIndex) {
			this.updateIndex(nextProps.stateIndex)
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
		if ( !enableDrag && onPress ) {
			onPress()
		}
	}

	_handlePanResponderMove(e, gestureState) {
		if (this.props.enableDrag) {
			let { modalState } = this;
			let draggedHeight = this._previousHeight - gestureState.dy;
			let maxHeight = modalState[modalState.length - 1];
			let minHeight = modalState[0];
			
			let height = ( draggedHeight < minHeight)? minHeight : ( draggedHeight > maxHeight)? maxHeight : draggedHeight;
			this.setState({
				height: new Animated.Value(height)
			})
		}
	}

	_handlePanResponderEnd(e, gestureState) {
		if (this.props.enableDrag) {
			let draggedHeight = this._previousHeight - gestureState.dy;
			let index = this.getNearestIndex(draggedHeight);
			this.updateIndex(index)
		}
	}

	updateIndex = (index) => {
		this.setState({index})
		Animated.timing(                 
			this.state.height,           
			{
				toValue: this.modalState[index],
				duration: 400,             
			}
		).start(); 
		
		this._previousHeight = this.modalState[index]
		this.props.onIndexChange(index)
	}

	getNearestIndex(height) {
		let { modalState } = this;
		for (i = 0; i < modalState.length; i++) { 
			if (i == modalState.length - 1) {
				// return modalState[i];
				return i;
			} else if (height < ((modalState[i] + modalState[i+1]) / 2) ) {
				// return modalState[i]
				return i
			}
		}
	}
		

	render() {
		const { height } = this.state
		return (
			<Animated.View 
				style={[ 
					styles.container, 
					{ 
						height, 
					}, 
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
	onIndexChange: PropTypes.func,
	speed: PropTypes.number
};

MultipleStateModal.defaultProps = {
	enableDrag: true,
	onPress: null,
	onIndexChange: () => {},
	speed: 300
};

const styles = StyleSheet.create({
	container: {
		width: SCREEN_WIDTH,
		alignItems: 'center',
	},
});