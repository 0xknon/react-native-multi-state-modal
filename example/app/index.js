/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
//import Modal from 'react-native-multi-state-modal'
import Modal from './Modal'

const { width, height } = Dimensions.get('window');

export default class example extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }

    onPress = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    onClose = () => {
        this.setState({isOpen: false})
    }

    render() {

        let { isOpen } = this.state;

        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => this.onPress()}>
                    <Text style={{color: 'white', fontSize: 20}}>Open modal</Text>
                </TouchableOpacity>
                <Modal
                    states={[ height * 3 / 16, height * 447 / 640 ]}
                    isOpen={isOpen}
                    openHeight={height * 3 / 16}
                    speed={300}
                    onCloseTop={() => {this.onClose()}}>
                    <View style={{flex: 1}}>
                        <Text style={{color: 'white', fontSize: 20}}>Test content</Text>
                    </View>
                </Modal>
            </View>
        );
    }
}

/*

                <Modal
                    modalState={[height * 3 / 16, height * 447 / 640, height ]}
                    isOpen={isOpen}
                    openTop={height * 447 / 640}
                    closeTop={height}
                    onCloseTop={() => {this.onClose()}}>
                    <View style={{flex: 1}}>
                        <Text style={{color: 'white', fontSize: 20}}>Test content</Text>
                    </View>
                </Modal>


*/


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

