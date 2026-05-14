import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sendCommand, checkHardwareConnection } from '../services/api';

const HomeScreen = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = width > 1000;

  const [isDrawerOpen, setIsDrawerOpen] = useState(isDesktop);
  const [hardwareStatus, setHardwareStatus] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const alarms = [
    { id: 'ROBO', label: 'ALERTA\nDE ROBO', icon: 'shield-account', color: '#DC2626', cmd: 'ALARM_ROBBERY' },
    { id: 'MEDICA', label: 'ALERTA DE\nEMERGENCIA MÉDICA', icon: 'plus-circle', color: '#DB2777', cmd: 'ALARM_MEDICAL' },
    { id: 'INCENDIO', label: 'ALERTA\nDE INCENDIO', icon: 'fire', color: '#EA580C', cmd: 'ALARM_FIRE' },
    { id: 'EVACUACION', label: 'ALERTA\nDE EVACUACIÓN', icon: 'run', color: '#EAB308', cmd: 'ALARM_EVACUATION' },
    { id: 'SILENCIOSA', label: 'ALERTA\nSILENCIOSA', icon: 'bell-off', color: '#7C3AED', cmd: 'ALARM_SILENT' },
    { id: 'APAGAR', label: 'APAGAR\nSISTEMA', icon: 'power', color: '#16A34A', cmd: 'ALARM_DISARM' },
    { id: 'IDENTIDAD', label: 'IDENTIFICACIÓN\nDE USUARIOS', icon: 'account-group', color: '#2563EB', cmd: null },
    { id: 'PANICO', label: 'PÁNICO\nGEOLOCALIZADO', icon: 'map-marker', color: '#1E3A8A', cmd: 'ALARM_PANIC' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    const checkStatus = async () => setHardwareStatus(await checkHardwareConnection());
    checkStatus();
    const statusInterval = setInterval(checkStatus, 5000);
    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    if (isDesktop) setIsDrawerOpen(true);
  }, [isDesktop]);

  const handleAction = async (type, command, label) => {
    if (!hardwareStatus) return;
    await sendCommand(command);
  };

  const themeColors = {
    bg: isDarkMode ? '#0A0E17' : '#F3F4F6',
    card: isDarkMode ? '#111827' : '#FFFFFF',
    text: isDarkMode ? '#F9FAFB' : '#111827',
    subText: isDarkMode ? '#94A3B8' : '#6B7280',
    border: isDarkMode ? '#1F2937' : '#E5E7EB',
    sidebar: isDarkMode ? '#0F172A' : '#0B1E4A'
  };

  return (
    <View style={[styles.mainLayout, { backgroundColor: themeColors.bg }]}>
      {(isDrawerOpen || isDesktop) && (
        <View style={[styles.sidebar, { backgroundColor: themeColors.sidebar }, isDesktop ? { position: 'relative' } : { position: 'absolute', top: 0, bottom: 0, left: 0, zIndex: 100 }]}>
          <View style={styles.sidebarHeader}>
            <Image source={require('../../assets/logoEvo.png')} style={styles.sidebarLogo} resizeMode="contain" />
            <View>
              <Text style={styles.appName}>EVO</Text>
              <Text style={styles.companyName}>SOLUTIONS</Text>
            </View>
          </View>

          <View style={styles.sidebarNav}>
            <TouchableOpacity style={styles.sideItemActive}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#0E2E70" style={{ marginRight: 12 }} />
              <Text style={[styles.sideItemLabel, { color: '#0E2E70' }]}>Alarmas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideItem} onPress={toggleTheme}>
              <MaterialCommunityIcons name={isDarkMode ? "weather-sunny" : "weather-night"} size={22} color="#FFF" style={{ marginRight: 12 }} />
              <Text style={styles.sideItemLabel}>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sideItem} onPress={onLogout}>
              <MaterialCommunityIcons name="logout" size={22} color="#FFF" style={{ marginRight: 12 }} />
              <Text style={styles.sideItemLabel}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.sidebarFooterCard, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#133072' }]}>
            <Text style={styles.sidebarFooterTitle}>Tu hogar, siempre{'\n'}conectado y protegido.</Text>
            <View style={{alignItems: 'center', marginVertical: 10}}>
              <Image source={require('../../assets/logoEvo.png')} style={styles.sidebarBotImg} resizeMode="contain" />
            </View>
            <Text style={styles.sidebarFooterDesc}>Sistema basado en ESP32{'\n'}con tecnología inteligente.</Text>
          </View>
        </View>
      )}

      <SafeAreaView style={[styles.contentArea, { backgroundColor: themeColors.bg }]}>
        {!isDesktop && (
          <View style={[styles.mobileHeader, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
            <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
              <MaterialCommunityIcons name="menu" size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.mobileTitle, { color: themeColors.text }]}>Alarmas</Text>
            <View style={styles.bellIconWrap}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={themeColors.text} />
              <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
            </View>
          </View>
        )}
        
        <ScrollView contentContainerStyle={[styles.scrollContent, { padding: isDesktop ? 40 : 20 }]} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.tabContainer, { opacity: fadeAnim }]}>
            {isDesktop && (
              <View style={styles.headerRow}>
                <View>
                  <Text style={[styles.pageTitle, { color: themeColors.text }]}>Alarmas</Text>
                  <Text style={[styles.pageSubtitle, { color: themeColors.subText }]}>Pulsa un botón para activar la alarma correspondiente.</Text>
                </View>
                <View style={styles.headerRight}>
                  <View style={styles.bellIconWrap}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color={themeColors.subText} />
                    <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
                  </View>
                  <View style={[styles.avatar, { backgroundColor: isDarkMode ? '#1F2937' : '#E2E8F0' }]}>
                    <MaterialCommunityIcons name="account" size={24} color={themeColors.subText} />
                  </View>
                </View>
              </View>
            )}

            <View style={[styles.infoBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }, !isDesktop && { flexDirection: 'column', alignItems: 'flex-start' }]}>
              <View style={styles.infoLeft}>
                <View style={[styles.infoIconCircle, { backgroundColor: isDarkMode ? 'rgba(37,99,235,0.1)' : '#EFF6FF' }]}><MaterialCommunityIcons name="shield-check" size={24} color="#2563EB" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoTitle, { color: themeColors.text }]}>Consejo de seguridad</Text>
                  <Text style={[styles.infoSubText, { color: themeColors.subText }]}>Usa estas alarmas solo en caso real de emergencia.</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.sosButton, { borderColor: themeColors.border, width: isDesktop ? 'auto' : '100%', marginTop: isDesktop ? 0 : 10 }]}>
                <MaterialCommunityIcons name="phone" size={18} color="#2563EB" />
                <Text style={styles.sosText}>Emergencia rápida 911</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.alarmGrid, { justifyContent: 'space-between' }]}>
              {alarms.map(alarm => (
                <TouchableOpacity 
                  key={alarm.id} 
                  style={[
                    styles.alarmCard, 
                    { 
                      borderColor: alarm.color, 
                      width: isDesktop ? '23.5%' : '48.5%', 
                      backgroundColor: themeColors.card,
                      marginBottom: isDesktop ? 20 : 12
                    }
                  ]} 
                  onPress={() => alarm.cmd && handleAction(alarm.id, alarm.cmd, alarm.label)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.alarmCardTop, { backgroundColor: alarm.color }]}>
                    <MaterialCommunityIcons name={alarm.icon} size={46} color="#FFF" />
                    <Text style={styles.alarmCardTitle}>{alarm.label}</Text>
                  </View>
                  <View style={[styles.alarmCardBottom, { backgroundColor: themeColors.card }]}>
                    <View style={[styles.activarPill, { borderColor: alarm.color }]}>
                      <Text style={[styles.activarText, { color: alarm.color }]}>ACTIVAR</Text>
                      <MaterialCommunityIcons name="arrow-right-circle" size={16} color={alarm.color} style={{ marginLeft: 8 }} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.footerBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }, !isDesktop && { flexDirection: 'column', alignItems: 'flex-start' }]}>
              <View style={styles.infoLeft}>
                <View style={styles.infoIconCircleSmall}><Text style={{color: '#FFF', fontWeight: 'bold'}}>i</Text></View>
                <Text style={[styles.footerBoxText, { color: themeColors.subText, flex: 1 }]}>Todas las alarmas se envían en tiempo real y notifican a los contactos y autoridades configuradas.</Text>
              </View>
              {isDesktop && (
                <View style={[styles.footerBoxRight, { backgroundColor: isDarkMode ? 'rgba(37,99,235,0.1)' : '#EFF6FF' }]}>
                  <MaterialCommunityIcons name="shield-check" size={16} color="#2563EB" />
                  <Text style={styles.footerBoxTextSmall}>Protegemos lo que más te importa</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
      
      {isDrawerOpen && !isDesktop && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setIsDrawerOpen(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainLayout: { flex: 1, flexDirection: 'row' },
  sidebar: { 
    width: 260, 
    padding: 20
  },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  sidebarLogo: { width: 40, height: 40, marginRight: 10 },
  appName: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  companyName: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', letterSpacing: 1 },
  sidebarNav: { flex: 1 },
  sideItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 4 },
  sideItemActive: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 4, backgroundColor: '#FFF' },
  sideItemLabel: { marginLeft: 12, fontWeight: '600', fontSize: 13, color: '#FFF' },
  sidebarFooterCard: { padding: 15, borderRadius: 15, marginTop: 20, alignItems: 'center' },
  sidebarFooterTitle: { color: '#FFF', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  sidebarBotImg: { width: 70, height: 70 },
  sidebarFooterDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 10, textAlign: 'center', marginTop: 10, lineHeight: 14 },
  
  contentArea: { flex: 1 },
  scrollContent: { },
  tabContainer: { flex: 1, paddingBottom: 40 },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  pageTitle: { fontSize: 26, fontWeight: '900' },
  pageSubtitle: { fontSize: 14, marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellIconWrap: { position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#2563EB', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  
  infoBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  infoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  infoIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoTitle: { fontSize: 14, fontWeight: 'bold' },
  infoSubText: { fontSize: 12, flexWrap: 'wrap' },
  sosButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderRadius: 8, justifyContent: 'center' },
  sosText: { color: '#2563EB', fontWeight: 'bold', fontSize: 13, marginLeft: 5 },
  
  alarmGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  alarmCard: { borderRadius: 15, borderWidth: 1, overflow: 'hidden', flexDirection: 'column' },
  alarmCardTop: { padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 150 },
  alarmCardTitle: { color: '#FFF', fontWeight: '800', fontSize: 13, textAlign: 'center', marginTop: 15, lineHeight: 18 },
  alarmCardBottom: { padding: 15, alignItems: 'center', height: 65, justifyContent: 'center' },
  activarPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  activarText: { fontWeight: 'bold', fontSize: 11 },
  
  footerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1 },
  infoIconCircleSmall: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  footerBoxText: { fontSize: 12, flexWrap: 'wrap', lineHeight: 18 },
  footerBoxRight: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  footerBoxTextSmall: { fontSize: 11, color: '#2563EB', fontWeight: '600', marginLeft: 5 },

  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  mobileTitle: { fontSize: 18, fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }
});

export default HomeScreen;
