import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions, SafeAreaView, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = ({ onLogin, onNavigateRegister, isDarkMode, toggleTheme }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    if (email && password) {
      onLogin({ name: email.split('@')[0], role: 'Administrador' });
    }
  };

  const sidebarWidth = width > 1200 ? 450 : 380;
  const paddingLeftPane = width > 1200 ? 60 : 40;
  const fontSizeTitle = width > 1200 ? 34 : 26;

  const themeColors = {
    bg: isDarkMode ? '#0A0E17' : '#F3F4F6',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F9FAFB' : '#0A1C40',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    inputBg: isDarkMode ? '#0F172A' : '#FFFFFF'
  };

  const renderLeftDesktopPane = () => (
    <View style={[styles.leftPane, { width: sidebarWidth, padding: paddingLeftPane, backgroundColor: isDarkMode ? '#0F172A' : '#0B1E4A' }]}>
      <View style={styles.logoRowLeft}>
        <View style={styles.logoCircleLight}>
          <Image source={require('../../assets/logoEvo.png')} style={styles.smallLogo} resizeMode="contain" />
        </View>
        <View style={styles.logoTextCol}>
          <Text style={styles.logoTextEvoLight}>EVO</Text>
          <Text style={styles.logoTextSolLight}>SOLUTIONS</Text>
        </View>
      </View>
      <View style={styles.leftContent}>
        <Text style={[styles.leftTitle, { fontSize: fontSizeTitle, lineHeight: fontSizeTitle * 1.3 }]}>
          Tu hogar, siempre conectado y protegido.
        </Text>
        <Text style={[styles.leftDesc, { fontSize: width > 1200 ? 14 : 13 }]}>
          Monitorea, controla y recibe alertas en tiempo real desde cualquier lugar.
        </Text>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../../assets/logoEvo.png')} style={[styles.largeRobot, { height: width > 1200 ? 300 : 200 }]} resizeMode="contain" />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.bg, padding: isDesktop ? 40 : 0, justifyContent: isDesktop ? 'center' : 'flex-start', alignItems: isDesktop ? 'center' : 'stretch' }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
        <View style={[styles.container, { backgroundColor: themeColors.card, borderRadius: isDesktop ? 20 : 0, elevation: isDesktop ? 20 : 0, shadowOpacity: isDesktop ? 0.1 : 0 }]}>
          {isDesktop && renderLeftDesktopPane()}
          
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={[styles.rightPaneScroll, { backgroundColor: themeColors.card, justifyContent: 'center' }]} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.rightContent, { paddingHorizontal: isDesktop ? (width > 1200 ? 60 : 40) : 25, paddingVertical: isDesktop ? 40 : 20 }]}>
              {!isDesktop && (
                <View style={styles.logoContainer}>
                  <View style={[styles.logoCircleDark, { backgroundColor: isDarkMode ? '#F9FAFB' : '#0B1E4A' }]}>
                    <Image source={require('../../assets/logoEvo.png')} style={styles.largeLogo} resizeMode="contain" />
                  </View>
                  <View style={styles.logoTextCol}>
                    <Text style={[styles.logoTextEvoDark, { color: isDarkMode ? '#F9FAFB' : '#0B1E4A' }]}>EVO</Text>
                    <Text style={[styles.logoTextSolDark, { color: isDarkMode ? '#F9FAFB' : '#0B1E4A' }]}>SOLUTIONS</Text>
                  </View>
                </View>
              )}

              <View style={styles.headerCentered}>
                <Text style={[styles.titleText, { color: themeColors.text }]}>Iniciar sesión</Text>
                <Text style={[styles.subtitleText, { color: themeColors.subText }]}>Bienvenido de nuevo a EVO Solutions</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: themeColors.text }]}>Correo electrónico</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: themeColors.inputBg, borderColor: themeColors.border }]}>
                    <MaterialCommunityIcons name="email-outline" size={20} color={isDarkMode ? '#94A3B8' : '#94A3B8'} />
                    <TextInput 
                      placeholder="ejemplo@correo.com" 
                      placeholderTextColor="#94A3B8" 
                      style={[styles.input, { color: themeColors.text }]} 
                      value={email} 
                      onChangeText={setEmail} 
                      keyboardType="email-address" 
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: themeColors.text }]}>Contraseña</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: themeColors.inputBg, borderColor: themeColors.border }]}>
                    <MaterialCommunityIcons name="lock-outline" size={20} color={isDarkMode ? '#94A3B8' : '#94A3B8'} />
                    <TextInput 
                      placeholder="Ingresa tu contraseña" 
                      placeholderTextColor="#94A3B8" 
                      style={[styles.input, { color: themeColors.text }]} 
                      secureTextEntry={!showPassword} 
                      value={password} 
                      onChangeText={setPassword}
                      autoComplete="current-password"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconWrap}>
                      <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.optionsRow}>
                  <TouchableOpacity style={styles.checkboxContainer} activeOpacity={0.8} onPress={() => setRememberMe(!rememberMe)}>
                    <View style={[styles.checkbox, { borderColor: themeColors.border }, rememberMe && styles.checkboxActive]}>
                      {rememberMe && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
                    </View>
                    <Text style={[styles.checkboxText, { color: themeColors.subText }]}>Recordarme</Text>
                  </TouchableOpacity>
                  <TouchableOpacity><Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text></TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                  <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>

                <View style={styles.switchContainer}>
                  <Text style={[styles.switchTextNormal, { color: themeColors.subText }]}>¿No tienes una cuenta? </Text>
                  <TouchableOpacity onPress={onNavigateRegister} style={{ paddingVertical: 5 }}>
                    <Text style={styles.switchTextBold}>Regístrate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, flexDirection: 'row', width: '100%', maxWidth: 1000, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 20 }, shadowRadius: 30 },
  
  leftPane: { },
  logoRowLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logoCircleLight: { width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
  smallLogo: { width: 52, height: 52 },
  logoTextCol: { justifyContent: 'center' },
  logoTextEvoLight: { color: '#FFF', fontSize: 24, fontWeight: '900', lineHeight: 24 },
  logoTextSolLight: { color: '#FFF', fontSize: 12, fontWeight: '600', letterSpacing: 1.5, opacity: 0.8 },
  leftContent: { flex: 1 },
  leftTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 15 },
  leftDesc: { color: 'rgba(255,255,255,0.8)', lineHeight: 22, marginBottom: 40 },
  largeRobot: { width: '100%' },

  rightPaneScroll: { flexGrow: 1 },
  rightContent: { width: '100%', maxWidth: 450, alignSelf: 'center', paddingBottom: 60 },
  
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 35 },
  logoCircleDark: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
  largeLogo: { width: 70, height: 70 },
  logoTextEvoDark: { fontSize: 30, fontWeight: '900', lineHeight: 30 },
  logoTextSolDark: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, opacity: 0.9 },

  formContainer: { width: '100%' },
  headerCentered: { alignItems: 'center', marginBottom: 30, width: '100%', minHeight: 60, justifyContent: 'center' },
  titleText: { fontSize: 28, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  subtitleText: { fontSize: 14, textAlign: 'center' },
  
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 15, height: 54 },
  input: { flex: 1, marginLeft: 10, fontSize: 15, height: '100%', backgroundColor: 'transparent', ...Platform.select({ web: { outlineStyle: 'none' } }) },
  eyeIconWrap: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },

  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  checkbox: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 4, marginRight: 8, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#0B42A3', borderColor: '#0B42A3' },
  checkboxText: { fontSize: 13 },
  forgotPasswordText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600', paddingVertical: 5 },
  
  primaryButton: { backgroundColor: '#0B42A3', height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 40, elevation: 4, shadowColor: '#0B42A3', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  
  switchContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchTextNormal: { fontSize: 14 },
  switchTextBold: { color: '#0B42A3', fontSize: 14, fontWeight: 'bold' },
});


export default LoginScreen;
