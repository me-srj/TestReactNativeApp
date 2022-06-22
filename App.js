import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Button, Card } from "react-native-elements";
import { WebView } from "react-native-webview";
import * as DocumentPicker from 'expo-document-picker';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedFile:{},
      WebViewUrl: "",
      ModalVisible: false,
      FlatlistData: [
        {
          Cdisplay: 0,
          message: "Upload the invoice",
          from: { name: "User 1" },
          description: "Upload the file here",
          actions: [
            {
              control: "file",
              config: {},
            },
          ],
          from: { name: "User 1" },
        },
        {
          Cdisplay: 0,
          message: "Here is the report",
          from: { name: "User 2" },
          attachments: [
            {
              name: "report.pdf",
              url: "https://www.clickdimensions.com/links/TestPDFfile.pdf",
            },
          ],
        },
        {
          Cdisplay: 0,
          message: "Employees want to work from home",
          from: { name: "User 1" },
          description: "Should we allow this?",
          actions: [
            {
              control: "button",
              config: {
                label: "Yes",
              },
            },
            {
              control: "button",
              config: {
                label: "No",
              },
            },
          ],
        },
      ],
    };
  }
  ShowMe = (index) => {
    var oldList = this.state.FlatlistData;
    oldList.forEach((item, indexl) => {
      if (index == indexl) {
        oldList[indexl].Cdisplay = 70;
      } else {
        oldList[indexl].Cdisplay = 0;
      }
    });
    this.setState({ FlatlistData: oldList });
  };
  renderMyNoti = (item, index) => {
    // {console.log(item.message);}
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.ShowMe(index);
          }}
        >
          <Text
            style={{ fontSize: 18, flex: 1, marginLeft: 10, marginBottom: 5 }}
          >
            {item.message}
          </Text>
        </TouchableOpacity>
        <View style={{ height: item.Cdisplay, marginLeft: 12 }}>
          <Text>From : {item.from.name}</Text>
          {typeof(item.description)!="undefined"?<Text>{item.description}</Text>:<></>}
          {typeof item.actions != "undefined" ? (
            <>
              {item.actions[0].control == "file" ? (
                <>
                  <TouchableOpacity>
                    <Button
                    title={"Pick a File"}
                    onPress={()=>{
                      this.FilePickerAction();
                    }}>

                    </Button>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
              {item.actions[0].control == "button" ? (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={{ flex: 1 }}>
                    <Button
                      onPress={() => {
                        if (Platform.OS == "android") {
                          ToastAndroid.show(
                            "Clicked on " + item.actions[0].config.label,
                            ToastAndroid.SHORT
                          );
                        } else {
                          Alert.alert(
                            "Clicked On",
                            item.actions[0].config.label
                          );
                        }
                      }}
                      title={item.actions[0].config.label}
                    ></Button>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }}>
                    <Button
                      onPress={() => {
                        if (Platform.OS == "android") {
                          ToastAndroid.show(
                            "Clicked on " + item.actions[1].config.label,
                            ToastAndroid.SHORT
                          );
                        } else {
                          Alert.alert(
                            "Clicked On",
                            item.actions[1].config.label
                          );
                        }
                      }}
                      title={item.actions[1].config.label}
                    ></Button>
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          {typeof item.attachments != "undefined" ? (
            <>
              <TouchableOpacity>
                <Button
                  onPress={() => {
                    this.setState({
                      ModalVisible: !this.state.ModalVisible,
                      WebViewUrl: item.attachments[0].url,
                    });
                  }}
                  title={item.attachments[0].name}
                ></Button>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  };
  FilePickerAction= async ()=> {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if(result.type=="success")
      {
        var size=result.size/1000;
        var fix="kb";
        if(size>1000)
        {
          size=size/1000;
          fix="mb";
        }
        if(Platform.OS=="android")
        {
          ToastAndroid.show("Picked"+ result.mimeType+" ("+ parseFloat(size).toFixed(2)+" "+fix+") "+result.name,ToastAndroid.SHORT);
        }
        else
        {
          Alert.alert("Picked",result.mimeType+" ("+size+") "+result.name);
        }
      }
      else
      {
        if(Platform.OS=="android")
        {
          ToastAndroid.show("Cancelled",ToastAndroid.SHORT);
        }
        else
        {
          Alert.alert("Cancelled","File Picking Cancelled");
        }
      }

      console.log(result);
    } catch (err) {
      console.warn(err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Card>
          <Card.Title style={{ fontSize: 22 }}>My Notifications</Card.Title>
          <FlatList
            data={this.state.FlatlistData}
            renderItem={({ item, index }) => this.renderMyNoti(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </Card>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.ModalVisible}
            onRequestClose={() => {
              // Alert.alert("Modal has been closed.");
              this.setState({ ModalVisible: !this.state.ModalVisible });
            }}
          >
            <View style={styles.modalView}>
              <Text>
                Download Will be start in a moment
              </Text>
              <WebView
                source={{
                  uri:  this.state.WebViewUrl,
                }}
                startInLoadingState={true}
                allowUniversalAccessFromFileURLs={true}
                javaScriptEnabled={true}
                mixedContentMode={"always"}
                onFileDownload={() => {
                  console.log("Downloading File");
                }}
                style={{
                  marginTop: 20,
                  height: 0,
                }}
              />
              <TouchableOpacity
              style={{marginTop:20}}
              >
              <Button
                onPress={() => {
                  this.setState({ ModalVisible: !this.state.ModalVisible });
                }}
                title={"Got it."}
                ></Button>
                </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    marginLeft:20,
    marginRight:20,
    marginTop: StatusBar.currentHeight+200,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
export default App;
