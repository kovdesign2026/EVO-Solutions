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

  // Dividimos las alarmas para el diseño central según la imagen
  const sideAlarmsLeft = [
    { id: 'ROBO', label: 'ALERTA\nDE ROBO', icon: 'shield', color: '#DC2626', cmd: 'ALARM_ROBBERY' },
    { id: 'INCENDIO', label: 'ALERTA\nDE INCENDIO', icon: 'fire', color: '#EA580C', cmd: 'ALARM_FIRE' },
    { id: 'MEDICA', label: 'EMERGENCIA\nMÉDICA', icon: 'plus-thick', color: '#DB2777', cmd: 'ALARM_MEDICAL' },
  ];

  const sideAlarmsRight = [
    { id: 'EVACUACION', label: 'ALERTA DE\nEVACUACIÓN', icon: 'run', color: '#EAB308', cmd: 'ALARM_EVACUATION' },
    { id: 'SILENCIOSA', label: 'ALERTA\nSILENCIOSA', icon: 'bell-off', color: '#7C3AED', cmd: 'ALARM_SILENT' },
    { id: 'IDENTIDAD', label: 'IDENTIFICACIÓN\nDE USUARIOS', icon: 'account-group', color: '#2563EB', cmd: null },
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
    if (!hardwareStatus || !command) return;
    await sendCommand(command);
  };

  const themeColors = {
    bg: isDarkMode ? '#061129' : '#F3F4F6',
    card: isDarkMode ? '#0B1E4A' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#111827',
    subText: isDarkMode ? '#9CA3AF' : '#6B7280',
    border: isDarkMode ? '#1E3A8A' : '#E5E7EB',
    sidebar: isDarkMode ? '#040A18' : '#0B1E4A',
    headerText: isDarkMode ? '#FFFFFF' : '#0B1E4A',
  };

  const CircularButton = ({ item }) => (
    <TouchableOpacity 
      style={styles.circularBtnContainer} 
      onPress={() => item.cmd && handleAction(item.id, item.cmd, item.label)}
      activeOpacity={0.7}
    >
      <View style={[styles.circleIcon, isDesktop && { width: 90, height: 90, borderRadius: 45 }, { backgroundColor: item.color }]}>
        <MaterialCommunityIcons name={item.icon} size={isDesktop ? 45 : 30} color="#FFF" />
      </View>
      <Text style={[styles.circleLabel, isDesktop && { fontSize: 13, marginTop: 12, lineHeight: 18 }, { color: themeColors.text }]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.mainLayout, { backgroundColor: themeColors.bg }]}>
      {/* Sidebar / Slider que se mantiene */}
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
          <View style={[styles.mobileHeader, { backgroundColor: themeColors.bg }]}>
            <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
              <MaterialCommunityIcons name="menu" size={28} color={themeColors.text} />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.headerEvoText, { color: themeColors.headerText }]}>EVO</Text>
              <Text style={styles.headerSolutionsText}>SOLUTIONS</Text>
            </View>
            <View style={styles.bellIconWrap}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={themeColors.text} />
              <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
            </View>
          </View>
        )}
        
        <ScrollView contentContainerStyle={[styles.scrollContent, { padding: isDesktop ? 40 : 15 }]} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.tabContainer, { opacity: fadeAnim, maxWidth: isDesktop ? 1200 : '100%', alignSelf: 'center', width: '100%' }]}>
            
            {/* CENTRAL ALARM SYSTEM (Diseño de la imagen) */}
            <View style={styles.alarmSystemContainer}>
              <View style={styles.sideAlarmsCol}>
                {sideAlarmsLeft.map(item => <CircularButton key={item.id} item={item} />)}
              </View>

              <View style={styles.centerAlarmCol}>
                <TouchableOpacity 
                  style={[styles.sosButtonBig, isDesktop && { width: 250, height: 250, borderRadius: 125 }]} 
                  onPress={() => handleAction('PANICO', 'ALARM_PANIC', 'SOS')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.sosButtonInner, isDesktop && { width: 200, height: 200, borderRadius: 100 }]}>
                    <Text style={[styles.sosTextBig, isDesktop && { fontSize: 60 }]}>SOS</Text>
                  </View>
                </TouchableOpacity>
                <Text style={[styles.sosTitle, isDesktop && { fontSize: 18, marginTop: 15 }, { color: themeColors.text }]}>PRESIONE SOS{'\n'}EN CASO DE EMERGENCIA</Text>
                <Text style={[styles.sosSubtitle, isDesktop && { fontSize: 14, marginTop: 5 }, { color: themeColors.subText }]}>Su alerta será enviada{'\n'}a la central comunitaria</Text>
              </View>

              <View style={styles.sideAlarmsCol}>
                {sideAlarmsRight.map(item => <CircularButton key={item.id} item={item} />)}
              </View>
            </View>

            {/* ACCIONES RÁPIDAS */}
            <View style={styles.sectionGroup}>
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
                <Text style={[styles.dividerText, isDesktop && { fontSize: 12, marginHorizontal: 25 }, { color: themeColors.subText }]}>ACCIONES RÁPIDAS</Text>
                <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
              </View>

              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={[styles.quickActionBox, isDesktop && { paddingVertical: 25, marginHorizontal: 15 }, { backgroundColor: '#16A34A' }]} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="whatsapp" size={isDesktop ? 45 : 32} color="#FFF" />
                  <Text style={[styles.quickActionText, isDesktop && { fontSize: 12, marginTop: 12, lineHeight: 16 }]}>LLAMAR{'\n'}WHATSAPP</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.quickActionBox, isDesktop && { paddingVertical: 25, marginHorizontal: 15 }, { backgroundColor: '#EAB308' }]} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="map-marker" size={isDesktop ? 45 : 32} color="#FFF" />
                  <Text style={[styles.quickActionText, isDesktop && { fontSize: 12, marginTop: 12, lineHeight: 16 }]}>ENVIAR{'\n'}UBICACIÓN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.quickActionBox, isDesktop && { paddingVertical: 25, marginHorizontal: 15 }, { backgroundColor: '#E11D48' }]} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="heart-outline" size={isDesktop ? 45 : 32} color="#FFF" />
                  <Text style={[styles.quickActionText, isDesktop && { fontSize: 12, marginTop: 12, lineHeight: 16 }]}>CONTACTOS{'\n'}DE CONFIANZA</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ESTADO DEL SISTEMA */}
            <View style={styles.sectionGroup}>
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
                <Text style={[styles.dividerText, isDesktop && { fontSize: 12, marginHorizontal: 25 }, { color: themeColors.subText }]}>ESTADO DEL SISTEMA</Text>
                <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
              </View>

              <TouchableOpacity style={[styles.statusCard, isDesktop && { padding: 25, marginHorizontal: 15 }, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} activeOpacity={0.8}>
                <View style={[styles.statusIconCircle, isDesktop && { width: 60, height: 60, borderRadius: 30, marginRight: 25 }, { borderColor: '#16A34A', borderWidth: 2, backgroundColor: isDarkMode ? 'rgba(22,163,74,0.1)' : '#DCFCE7' }]}>
                  <MaterialCommunityIcons name="power" size={isDesktop ? 34 : 24} color="#16A34A" />
                </View>
                <View style={styles.statusTextCol}>
                  <Text style={[styles.statusTitleActive, isDesktop && { fontSize: 16 }]}>SISTEMA ACTIVO</Text>
                  <Text style={[styles.statusSubtitle, isDesktop && { fontSize: 14 }, { color: themeColors.subText }]}>Todo en funcionamiento</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={isDesktop ? 30 : 24} color={themeColors.subText} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.statusCard, isDesktop && { padding: 25, marginHorizontal: 15 }, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} activeOpacity={0.8}>
                <View style={[styles.statusIconCircleFill, isDesktop && { width: 60, height: 60, borderRadius: 30, marginRight: 25 }, { backgroundColor: '#2563EB' }]}>
                  <MaterialCommunityIcons name="shield-check" size={isDesktop ? 28 : 20} color="#FFF" />
                </View>
                <View style={styles.statusTextCol}>
                  <Text style={[styles.statusSubtitle, isDesktop && { fontSize: 14 }, { color: themeColors.subText, fontSize: 11 }]}>Todas las alarmas se envían en tiempo real y notifican a los contactos y autoridades.</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={isDesktop ? 30 : 24} color={themeColors.subText} />
              </TouchableOpacity>
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
  
  contentArea: { flex: 1, flexDirection: 'column' },
  scrollContent: { flexGrow: 1 },
  tabContainer: { flex: 1, paddingBottom: 20, justifyContent: 'space-between' },
  sectionGroup: { marginBottom: 15 },
  
  // Header móvil
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 20, paddingBottom: 10 },
  headerEvoText: { fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  headerSolutionsText: { fontSize: 10, color: '#3B82F6', fontWeight: 'bold', letterSpacing: 2, marginTop: -3 },
  bellIconWrap: { position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#3B82F6', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

  // Alarm System Layout
  alarmSystemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  sideAlarmsCol: { flex: 1, justifyContent: 'space-between', alignItems: 'center', height: '100%', minHeight: 320 },
  centerAlarmCol: { flex: 2, alignItems: 'center', justifyContent: 'center' },
  
  circularBtnContainer: { alignItems: 'center', marginVertical: 10 },
  circleIcon: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  circleLabel: { fontSize: 9, fontWeight: 'bold', textAlign: 'center', marginTop: 8, lineHeight: 12, minHeight: 24 },

  sosButtonBig: { 
    width: 170, 
    height: 170, 
    borderRadius: 85, 
    backgroundColor: 'rgba(220, 38, 38, 0.15)', // Resplandor exterior
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 20
  },
  sosButtonInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 15
  },
  sosTextBig: { color: '#FFF', fontSize: 44, fontWeight: '900', letterSpacing: 2 },
  sosTitle: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  sosSubtitle: { fontSize: 10, textAlign: 'center', lineHeight: 14 },

  // Dividers
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, paddingHorizontal: 10 },
  dividerLine: { flex: 1, height: 1, opacity: 0.5 },
  dividerText: { marginHorizontal: 15, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 5 },
  quickActionBox: { flex: 1, marginHorizontal: 5, borderRadius: 12, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  quickActionText: { color: '#FFF', fontSize: 9, fontWeight: 'bold', textAlign: 'center', marginTop: 8, lineHeight: 12 },

  // Status Cards
  statusCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 15, marginHorizontal: 10 },
  statusIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  statusIconCircleFill: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  statusTextCol: { flex: 1, paddingRight: 10 },
  statusTitleActive: { color: '#16A34A', fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
  statusSubtitle: { fontSize: 11, lineHeight: 16 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }
});

export default HomeScreen;
