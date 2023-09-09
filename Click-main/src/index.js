import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const DetectObject = () => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setlabels] = useState([]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
      console.log(result);
    } catch (error) {
      console.error("Error Picking up Image", error);
    }
  };

  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert("Please select an image first!");
        return;
      }
      // api key
      const apiKey = "AIzaSyAdZG14wiDuybS7JBADEcugAR-zeTZx3K4";
      const apiUrl = `https://vision.googleapis.com/vI/images:annotate?key=${apiKey}`;

      // read image file from location uri and convert it to base 64
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
          },
        ],
      };
      const apiResponse = await axios.post(apiUrl, requestData);
      setlabels(apiResponse.data.responses[0].labelAnnotations);
    } catch (error) {
      console.error("Error analyzing");
      alert("Error, try again");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Clik</Text>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 300, height: 300 }} />
      )}
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.text}>Choose an Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={analyzeImage} style={styles.button}>
        <Text style={styles.text}>Search For Products</Text>
      </TouchableOpacity>
      {labels.length > 0 && (
        <View>
          <Text style={styles.label}>The Product category:</Text>
          {labels.map((label) => (
            <Text key={label.mid} style={styles.outputText}>
              (label.description)
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default DetectObject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 100,
  },
  button: {
    backgroundColor: "#FFFF00",
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 12,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  outputText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
