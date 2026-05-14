import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions, SafeAreaView, Image, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RegisterScreen = ({ onNavigateLogin, isDarkMode, toggleTheme }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Validaciones
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const isFormValid = name && email && hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch && termsAccepted;

  const handleRegister = () => {
    if (!isFormValid) return;
    if (Platform.OS === 'web') {
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
    } else {
      Alert.alert('Éxito', '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
    }
    onNavigateLogin();
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
          Crea tu cuenta y protege lo que más importa.
        </Text>
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Seguridad total 24/7</Text>
              <Text style={styles.featureDesc}>Protección inteligente siempre activa.</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Alertas en tiempo real</Text>
              <Text style={styles.featureDesc}>Recibe notificaciones al instante.</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <MaterialCommunityIcons name="cellphone" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Control total</Text>
              <Text style={styles.featureDesc}>Gestiona tu hogar desde tu móvil o PC.</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderReqItem = (met, text) => (
    <View style={styles.reqItem}>
      <MaterialCommunityIcons name={met ? "check-circle" : "circle-outline"} size={16} color={met ? "#22C55E" : "#94A3B8"} />
      <Text style={[styles.reqText, { color: met ? (isDarkMode ? '#F9FAFB' : '#1E293B') : '#94A3B8' }]}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.bg, padding: isDesktop ? 40 : 0, justifyContent: isDesktop ? 'center' : 'flex-start', alignItems: isDesktop ? 'center' : 'stretch' }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
        <View style={[styles.container, { backgroundColor: themeColors.card, borderRadius: isDesktop ? 20 : 0, elevation: isDesktop ? 20 : 0, shadowOpacity: isDesktop ? 0.1 : 0 }]}>
          {isDesktop && renderLeftDesktopPane()}

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.rightPaneScroll, { backgroundColor: themeColors.card, justifyContent: isDesktop ? 'center' : 'flex-start' }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.rightContent, { paddingHorizontal: isDesktop ? (width > 1200 ? 60 : 40) : 25, paddingTop: isDesktop ? 40 : 60 }]}>
              <View style={styles.formContainer}>

                <View style={styles.headerWithBack}>
                  <TouchableOpacity style={[styles.backButtonAbsolute, { backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC' }]} onPress={onNavigateLogin}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={isDarkMode ? '#F9FAFB' : '#0B1E4A'} />
                  </TouchableOpacity>
                  <View style={styles.headerTextContainer}>
                    <Text style={[styles.titleText, { color: themeColors.text }]}>Crear cuenta</Text>
                    <Text style={[styles.subtitleText, { color: themeColors.subText }]}>Completa tus datos para comenzar</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: themeColors.text }]}>Nombre completo</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: themeColors.inputBg, borderColor: themeColors.border }]}>
                    <MaterialCommunityIcons name="account-outline" size={20} color="#94A3B8" />
                    <TextInput
                      placeholder="Ingresa tu nombre"
                      placeholderTextColor="#94A3B8"
                      style={[styles.input, { color: themeColors.text }]}
                      value={name}
                      onChangeText={setName}
                      autoComplete="name"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: themeColors.text }]}>Correo electrónico</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: themeColors.inputBg, borderColor: themeColors.border }]}>
                    <MaterialCommunityIcons name="email-outline" size={20} color="#94A3B8" />
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
                    <MaterialCommunityIcons name="lock-outline" size={20} color="#94A3B8" />
                    <TextInput
                      placeholder="Crea una contraseña"
                      placeholderTextColor="#94A3B8"
                      style={[styles.input, { color: themeColors.text }]}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoComplete="new-password"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconWrap}>
                      <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: themeColors.text }]}>Confirmar contraseña</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: themeColors.inputBg, borderColor: confirmPassword.length > 0 && !passwordsMatch ? '#EF4444' : themeColors.border }]}>
                    <MaterialCommunityIcons name="lock-check-outline" size={20} color={confirmPassword.length > 0 && !passwordsMatch ? "#EF4444" : "#94A3B8"} />
                    <TextInput
                      placeholder="Confirma tu contraseña"
                      placeholderTextColor="#94A3B8"
                      style={[styles.input, { color: themeColors.text }]}
                      secureTextEntry={!showConfirm}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      autoComplete="new-password"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIconWrap}>
                      <MaterialCommunityIcons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
                  )}
                </View>

                <View style={[styles.requirementsContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderColor: themeColors.border }]}>
                  <Text style={[styles.requirementsTitle, { color: themeColors.text }]}>Requisitos de contraseña</Text>
                  {renderReqItem(hasMinLength, "Mínimo 8 caracteres")}
                  {renderReqItem(hasUpperCase, "Una mayúscula")}
                  {renderReqItem(hasLowerCase, "Una minúscula")}
                  {renderReqItem(hasNumber, "Un número")}
                  {renderReqItem(hasSpecialChar, "Un carácter especial")}
                </View>

                <TouchableOpacity style={styles.termsContainer} activeOpacity={0.8} onPress={() => setTermsAccepted(!termsAccepted)}>
                  <View style={[styles.checkbox, { borderColor: themeColors.border }, termsAccepted && styles.checkboxActive]}>
                    {termsAccepted && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
                  </View>
                  <Text style={[styles.termsText, { color: themeColors.subText }]}>
                    Acepto los <Text style={styles.linkBlue} onPress={() => alert('Próximamente: Términos y Condiciones')}>Términos y Condiciones</Text> y la <Text style={styles.linkBlue} onPress={() => alert('Próximamente: Política de Privacidad')}>Política de Privacidad</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, !isFormValid && styles.primaryButtonDisabled]}
                  disabled={!isFormValid}
                  onPress={handleRegister}
                >
                  <Text style={styles.primaryButtonText}>Crear cuenta</Text>
                </TouchableOpacity>

                <View style={styles.switchContainer}>
                  <Text style={[styles.switchTextNormal, { color: themeColors.subText }]}>¿Ya tienes una cuenta? </Text>
                  <TouchableOpacity onPress={onNavigateLogin} style={{ paddingVertical: 5 }}>
                    <Text style={styles.switchTextBold}>Iniciar sesión</Text>
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

  leftPane: {},
  logoRowLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logoCircleLight: { width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
  smallLogo: { width: 52, height: 52 },
  logoTextCol: { justifyContent: 'center' },
  logoTextEvoLight: { color: '#FFF', fontSize: 24, fontWeight: '900', lineHeight: 24 },
  logoTextSolLight: { color: '#FFF', fontSize: 12, fontWeight: '600', letterSpacing: 1.5, opacity: 0.8 },
  leftContent: { flex: 1, justifyContent: 'center' },
  leftTitle: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 30, lineHeight: 44 },
  features: {},
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  featureIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  featureTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  featureDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 18 },

  rightPaneScroll: { flexGrow: 1 },
  rightContent: { width: '100%', maxWidth: 450, alignSelf: 'center', paddingBottom: 60 },

  formContainer: { width: '100%' },
  headerWithBack: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, width: '100%', minHeight: 60, justifyContent: 'center' },
  backButtonAbsolute: { position: 'absolute', left: 0, width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 21, zIndex: 10 },
  headerTextContainer: { alignItems: 'center', width: '100%' },
  titleText: { fontSize: 28, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  subtitleText: { fontSize: 14, textAlign: 'center' },

  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 15, height: 54 },
  input: { flex: 1, marginLeft: 10, fontSize: 15, height: '100%', backgroundColor: 'transparent', ...Platform.select({ web: { outlineStyle: 'none' } }) },
  eyeIconWrap: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 5, marginLeft: 5 },

  requirementsContainer: { padding: 20, borderRadius: 15, marginBottom: 25, borderWidth: 1 },
  requirementsTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  reqItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reqText: { fontSize: 13, marginLeft: 10 },

  termsContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30, paddingRight: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderRadius: 6, marginRight: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checkboxActive: { backgroundColor: '#0B42A3', borderColor: '#0B42A3' },
  termsText: { fontSize: 13, lineHeight: 20, flex: 1 },
  linkBlue: { color: '#1D4ED8', fontWeight: 'bold' },

  primaryButton: { backgroundColor: '#0B42A3', height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 40, elevation: 4, shadowColor: '#0B42A3', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10 },
  primaryButtonDisabled: { backgroundColor: '#94A3B8', shadowOpacity: 0, elevation: 0 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  switchContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchTextNormal: { fontSize: 14 },
  switchTextBold: { color: '#0B42A3', fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;
