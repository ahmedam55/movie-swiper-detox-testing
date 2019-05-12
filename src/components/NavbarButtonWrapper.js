import React from 'react';
import { View, TouchableOpacity } from 'react-native'
import { TouchableScale } from './common';

class NavbarButtonWrapper extends React.Component {
  render() {
    const { children = [], style, onPress } = this.props;

    const childText = children.filter(child => child.props.children).map(child => child.props.children)[0] || ''

    const testID = `navigation-btn-${childText}`

    return (
      <View style={style}>
        <TouchableScale
          testID={testID}
          style={{ flex: 1 }}
          onPress={onPress}
          initialScale={0.9}
          scaleFactor={0.9}
        >
          {children}
        </TouchableScale>
      </View>
    )
  }
}

export default NavbarButtonWrapper;
