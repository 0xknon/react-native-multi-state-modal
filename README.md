
# react-native-multi-state-modal
[![npm version](https://badge.fury.io/js/react-native-multi-state-modal.svg)](https://badge.fury.io/js/react-native-multi-state-modal)

A simple and customisable react-native multi-state modal

## Features
- Customizable state by array of height
- Customizable speed during transition
- Draggable 

## Demo

<p align="center">
<img src="https://media.giphy.com/media/3oFzm2uDRXErwdspRm/giphy.gif" height="500" />
</p>

## Setup
Install it with: 

`npm install --save react-native-multi-state-modal` , or 

`yarn add react-native-multi-state-modal`.

## Usage

```javascript
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
import Modal from 'react-native-multi-state-modal'

const { width, height } = Dimensions.get('window');

export default class example extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            buttonText: 'Open modal'
        }
    }

    onPress = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            buttonText: 'Close modal'
        })
    }

    onClose = () => {
        this.setState({
            isOpen: false,
            buttonText: 'Open modal'
        })
    }

    render() {

        let { isOpen } = this.state;

        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => this.onPress()}>
                    <Text style={{color: 'white', fontSize: 20}}>{this.state.buttonText}</Text>
                </TouchableOpacity>
                <Modal
                    states={[ height * 3 / 16, height * 447 / 640 ]}
                    isOpen={isOpen}
                    openHeight={height * 3 / 16}
                    speed={300}
                    onClose={() => {this.onClose()}}>
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
```
For a more complex example take a look at the /example directory.
## props

| Name | Type| Default | Required | Description |
| --- | --- | --- | --- | --- |
| states | array | NA | Yes | Array oh height of each state in ascending order |
| isOpen | bool | NA | Yes | Open model? |
| openHeight | number | screenHeight / 2 | No | Initial height when the modal is opened|
| speed | number | 300 | No | Speed during transition between states |
| onClose | func | null | No | Called when the modal is closed |

