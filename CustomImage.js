import React from 'react';
import { Image, StyleSheet } from 'react-native';

const CustomImage = (props) => {
    return (
        <Image
            {...props}
            style={[styles.image, props.style]} // Apply any additional styles
            resizeMode="cover"
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',   // Set width to 100% of the container
        height: 200,     // Adjust height as needed
        borderRadius: 8,
        marginTop: 8,
    },
});

export default CustomImage;
