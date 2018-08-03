import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-multi-state-modal'

const { width, height } = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
		super(props);

		this.state = {
			stateIndex: 0,
			buttonText: 'Open modal'
		}
	}

	render() {

		let { stateIndex } = this.state;
		return (
			<View style={styles.container}>
				<View style={{flex: 1}} >
					<TouchableOpacity 
						style={styles.button}
						onPress={() => this.setState({stateIndex: stateIndex == 0? 1 : 0})}>
						<Text style={{color: 'white', fontSize: 20}}>{this.state.buttonText}</Text>
					</TouchableOpacity>
				</View>
				<Modal
					style={{backgroundColor: 'white'}}
					states={[0, height * 3 / 16, height * 447 / 640 ]}
					stateIndex={stateIndex}
					speed={300} 
					onIndexChange={(index) => this.setState({stateIndex: index})} >
					<View style={{flex: 1}}>
						<Text style={{color: 'black', fontSize: 20}}>Test content</Text>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	button: {
		paddingHorizontal: 12, 
		paddingVertical: 6, 
		backgroundColor: 'grey'
	}
});

