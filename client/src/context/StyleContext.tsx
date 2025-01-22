import { createContext, useContext } from "react";
import { ImageStyle, TextStyle } from "react-native";
export function useStyleContext() {
    return useContext(StyleContext).styles;
}
type CustomStyle = {
    footerH1: TextStyle
    footerH3: TextStyle
    footerSocialImage: ImageStyle
    footerAppImage: ImageStyle
    bold: TextStyle
    confirmationCodeWrapper: TextStyle
    indent: TextStyle
    link: TextStyle
    linkMore: TextStyle
    header: TextStyle
    textHeader: TextStyle
    h1: TextStyle
    h2: TextStyle
    h3: TextStyle
    container: TextStyle
    container2: TextStyle
    button: TextStyle
    modalContent: TextStyle
    textInput: TextStyle
    title: TextStyle
    pickerContainer: TextStyle
    input: TextStyle
    map: TextStyle
    map2: TextStyle
    mapScan: TextStyle
    appImage: ImageStyle
    printSpacer: TextStyle
    printer: TextStyle
    printContainer: TextStyle
    p1: TextStyle
    createAccountButtonWrapper: TextStyle
    authView: TextStyle
    authView2: TextStyle
    mySignInForgotPassword: TextStyle
    signUpBackButtonWrapper: TextStyle
    authView3: TextStyle
    mySignUpText: TextStyle
    mySignUpInputFieldscontainer: TextStyle
    mySignUpPlaceholderText: TextStyle
    mySignUpEmailContainer: TextStyle
    mySignUpPasswordContainer: TextStyle
    mySignUpLeftPasswordContainer: TextStyle
    mySignUpConfirmCode: TextStyle
    authView3Welcome: TextStyle
    mySignUpButton: TextStyle
    mySignUpOr: TextStyle
    c1: TextStyle
    c2: TextStyle
    c3: TextStyle
    c4: TextStyle
    c5: TextStyle
    c6: TextStyle
    c7: TextStyle
    table: TextStyle
    headerC1: TextStyle
    headerC2: TextStyle
    headerC3: TextStyle
    headerC4: TextStyle
    headerC5: TextStyle
    headerC6: TextStyle
    headerC7: TextStyle
    headerRow: TextStyle
    row: TextStyle
    tableBody: TextStyle
    tableText: TextStyle
}
export type StyleContext = {
    styles: CustomStyle | null


};
export const StyleContext = createContext<StyleContext>({
    styles: null,

});
