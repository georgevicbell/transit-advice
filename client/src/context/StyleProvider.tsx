import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import { StyleContext } from "../context/StyleContext";
type Props = {
    children: any;
};

export function StyleProvider(props: Props) {
    const { width } = useWindowDimensions()
    const styles = StyleSheet.create({

        bold: { fontWeight: "bold" },
        container: { padding: 20 },

        indent: { marginLeft: 10 },
        link: { color: "blue", textDecorationLine: "underline" },
        linkMore: { color: "blue", textDecorationLine: "underline", fontSize: 12 },
        header: { flexDirection: "row" },
        textHeader: { flexDirection: "column", borderWidth: 1, borderRadius: 5, padding: 10 },
        map: { borderWidth: 1, borderColor: "#000", height: 200, width: 200 },
        h1: { fontWeight: "bold", fontSize: 24, marginBottom: 10, marginTop: 10 },
        h2: { fontWeight: "bold", fontSize: 14, marginBottom: 5, marginTop: 5 },
        p1: { fontSize: 14, marginBottom: 5, marginTop: 5 },
        footerH1: { fontWeight: "bold", fontSize: 20, color: "#000" },
        footerH3: { fontSize: 16, color: "#000" },
        footerSocialImage: {
            width: 24,
            height: 24,
            margin: 5,

        },
        footerAppImage: {
            margin: 15,
            width: 120,
            height: 90,

        },
        appImage: {
            margin: 15,
            width: 120,
            height: 90,
        },
        container2: {
            flex: 1,
            padding: 10,
            alignItems: "flex-start",
            justifyContent: "flex-start",
        },


        h3: { fontSize: 16 },

        button: {
            borderWidth: 1, borderRadius: 5,
            padding: 5, margin: 5,
            borderColor: "gray", backgroundColor: "#fff",
            alignItems: "center"
        },

        modalContent: {
            left: '25%',
            top: '25%',
            height: '50%',
            width: '50%',
            backgroundColor: '#fff',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#000",


        },



        title: {
            color: '#fff',
            fontSize: 16,
        },
        pickerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 50,
            paddingVertical: 20,
        },
        textInput: { borderColor: 'gray', margin: 5, borderRadius: 5, borderWidth: 1, padding: 5 },


        input: { borderWidth: 1, borderRadius: 5, padding: 10, margin: 5, borderColor: "gray" },

        mapScan: {
            borderRadius: 10,
            margin: 5,
            height: '40%',
        },
        map2: {
            width: '100%',
            height: '100%',
        },
        printSpacer: { flexDirection: "row" },
        printContainer: { backgroundColor: "#ffff00", height: "100%" },
        printer: {},


        createAccountButtonWrapper:
            width < 720
                ? {
                    position: "absolute",
                    top: "0%",
                    left: "2%",
                    marginTop: 5,
                }
                : {
                    position: "absolute",
                    top: "6%",
                    right: "3.5%",
                },
        authView:
            Platform.OS === "web" && width > 720
                ? { left: "35%", width: "40%", top: 100, height: "auto" }
                : { left: "2%", width: "96%", top: "0%", height: "100%" },
        authView2:
            Platform.OS === "web" && width > 720
                ? { alignSelf: "center", top: "20%", height: "auto" }
                : { left: "2%", width: "96%", top: "12%", height: "100%" },
        mySignInForgotPassword: {
            alignSelf: "flex-end",
            marginRight: 30,
            fontSize: 14,
            lineHeight: 22,
            color: "#fff",
            opacity: 0.7,
            marginTop: 20,
        },
        confirmationCodeWrapper:
            width < 720
                ? { display: "flex", flexDirection: "column" }
                : { display: "flex", flexDirection: "row" },

        signUpBackButtonWrapper:
            width >= 720
                ? { position: "absolute", top: "10%", left: "30%", zIndex: 9999 }
                : {
                    position: "absolute",
                    top: 0,
                    left: "2%",
                    marginTop: Platform.OS === "android" ? 50 : 10,
                    zIndex: 9999,
                },
        authView3:
            Platform.OS === "web" && width > 720
                ? { alignSelf: "center", width: 600, top: "15%", height: "auto" }
                : { left: "2%", width: "96%", top: "0%", height: "100%" },

        mySignUpText:
            width >= 720
                ? {
                    width: "100%",
                    marginBottom: "8.33%",
                    fontWeight: "bold",
                    fontSize: 22,
                    lineHeight: 30,
                    alignSelf: "center",
                }
                : {
                    marginTop:
                        Platform.OS === "android" || Platform.OS === "web" ? 50 : 50,
                    width: "100%",
                    textAlign: "center",
                },

        mySignUpInputFieldscontainer:
            width >= 720
                ? {
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "5.5%",
                }
                : {
                    display: "flex",
                    flexDirection: "row",
                    marginRight: 0,
                    marginLeft: 10,
                },

        mySignUpPlaceholderText: {
            borderBottomWidth: 1,
            borderColor: "#00000020",
            marginBottom: "1.4%",
            marginRight: 30,
            width: "100%",
            paddingTop: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingLeft: 5,
            fontSize: width >= 720 ? 16 : 15,
            lineHeight: 24,
        },
        mySignUpEmailContainer:
            width >= 720
                ? {
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "1.4%",
                }
                : {
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "1.4%",
                    marginRight: 0,
                    marginLeft: 10,
                },

        mySignUpPasswordContainer:
            width >= 720
                ? {
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "5.5%",
                }
                : {
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "5.5%",
                    marginRight: 0,
                    marginLeft: 10,
                },

        mySignUpLeftPasswordContainer:
            width >= 720
                ? {
                    borderBottomWidth: 1,
                    borderColor: "#00000020",
                    marginBottom: "1.4%",
                    marginRight: 30,
                    width: "100%",
                    paddingTop: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    paddingLeft: 5,
                    fontSize: 16,
                    lineHeight: 24,
                }
                : {
                    borderBottomWidth: 1,
                    borderColor: "#00000020",
                    marginBottom: "1.4%",
                    marginRight: 0,
                    width: "100%",
                    paddingTop: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    paddingLeft: 5,
                    fontSize: 15,
                    marginLeft: 0,
                },

        mySignUpConfirmCode:
            width >= 720
                ? {
                    alignSelf: "flex-end",
                    paddingHorizontal: 30,
                    paddingBottom: 15,
                    paddingTop: 15,
                }
                : {
                    alignSelf: "flex-start",
                    marginLeft: 10,
                    paddingHorizontal: 30,
                    paddingBottom: 15,
                    paddingTop: 15,
                },

        authView3Welcome:
            width < 720
                ? {
                    width: "100%",
                    marginTop: "2%",
                    marginBottom: "5.5%",
                    fontWeight: "bold",
                    fontSize: 18,
                    lineHeight: 30,
                    textAlign: "center",
                }
                : {
                    width: "100%",
                    marginTop: "2%",
                    marginBottom: "5.5%",
                    fontWeight: "bold",
                    fontSize: 28,
                    lineHeight: 30,
                },

        mySignUpButton:
            width >= 720
                ? {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 15,
                }
                : {
                    flexDirection: "column",
                    height: "auto",
                },

        mySignUpOr:
            width < 720
                ? {
                    marginTop: 15,
                    marginBottom: 15,
                    width: "40%",
                }
                : {
                    fontWeight: "bold",
                    fontSize: 22,
                    marginHorizontal: 15,
                },

        table: {
            margin: 10,

            flex: 1,

        },
        tableText: {
            fontSize: 12,
        },
        tableBody: {
            flexBasis: "auto",

        },
        headerRow: {
            backgroundColor: "#ddd",

            flexDirection: "row",

        },
        headerC1: {
            flex: 3,
            padding: 10,
            borderWidth: 1,

        },
        headerC2: {
            padding: 10,
            flex: 3,
            borderWidth: 1,
        },
        headerC3: {
            padding: 10,
            flex: 1,
            borderWidth: 1,
        },
        headerC4: {
            padding: 10,
            flex: 1,
            borderWidth: 1,
        },
        headerC5: {
            padding: 10,
            flex: 1,
            borderWidth: 1,
        },
        headerC6: {
            padding: 10,
            flex: 1,
            borderWidth: 1,
        },
        headerC7: {
            padding: 10,
            flex: 5,
            borderWidth: 1,
        },
        row: {
            flex: 1,
            flexDirection: "row",

        },
        c1: {
            flex: 3,
            borderWidth: 1,
            padding: 10,

        },
        c2: {
            flex: 3,
            borderWidth: 1,
            padding: 10,
        },
        c3: {
            flex: 1,
            borderWidth: 1,
            padding: 10,
        }, c4: {
            flex: 1,
            borderWidth: 1,
            padding: 10,
        }, c5: {
            flex: 1,
            borderWidth: 1,
            padding: 10,
            flexWrap: "nowrap",
        }, c6: {
            flex: 1,
            borderWidth: 1,
            padding: 10,
            flexWrap: "nowrap",
        }, c7: {
            flex: 5,
            borderWidth: 1,
            padding: 10,
            flexWrap: "nowrap",
        },
    });
    return <StyleContext.Provider
        value={{
            styles: styles
        }}
    >
        {props.children}
    </StyleContext.Provider>

}